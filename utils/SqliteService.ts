import * as SQLite from 'expo-sqlite';
import { Habit } from '../types';
import { booleanToNumber, dateToISOString, isoStringToDate, numberToBoolean, uuid } from '.';

class SQLiteService {
  static db: SQLite.SQLiteDatabase | null = null;

  static async init() {
    if (!SQLiteService.db) {
      SQLiteService.db = await SQLite.openDatabaseAsync('habits.db');

      await SQLiteService.db.execAsync(
        `CREATE TABLE IF NOT EXISTS habits (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          emoji TEXT NOT NULL DEFAULT '⭐',
          completed INTEGER NOT NULL DEFAULT 0,
          frequency TEXT NOT NULL,
          target TEXT NOT NULL,
          createdAt TEXT NOT NULL
        );`
      );

      await SQLiteService.db.execAsync(
        `CREATE TABLE IF NOT EXISTS habit_completed_dates (
          id TEXT PRIMARY KEY NOT NULL,
          habit_id TEXT NOT NULL,
          completed_date TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
        );`
      );

      console.log('Database initialized');
    }
  }

  static async truncate() {
    if (!SQLiteService.db) return;

    await SQLiteService.db.execAsync('DELETE FROM habits;');
    await SQLiteService.db.execAsync('DELETE FROM habit_completed_dates;');
    console.log('Tables truncated');
  }

  static async addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>): Promise<string | undefined> {
    let id: string | undefined;
    try {
      if (!SQLiteService.db) throw new Error('Database not initialized');

      id = uuid();
      const createdAt = new Date();
      await SQLiteService.db.runAsync(
        `INSERT INTO habits (id, name, description, emoji, completed, frequency, target, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          id,
          habit.name,
          habit.description || null,
          habit.emoji,
          booleanToNumber(habit.completed || false),
          habit.frequency,
          habit.target,
          dateToISOString(createdAt)
        ]
      );

      return id;
    } catch (error) {
      console.log(error);      
    }

    return id;
  }

  static async getHabits(): Promise<Array<Habit>> {
    if (!SQLiteService.db) return [];

    try {
      const habitsResult = await SQLiteService.db.getAllAsync('SELECT * FROM habits ORDER BY createdAt DESC;');

      const datesResult = await SQLiteService.db.getAllAsync('SELECT * FROM habit_completed_dates;');

      const habits: Array<Habit> = habitsResult.map((habitRow: any) => {
        const habitDates = datesResult
          .filter((dateRow: any) => dateRow.habit_id === habitRow.id)
          .map((dateRow: any) => isoStringToDate(dateRow.completed_date));

        return {
          id: habitRow.id,
          name: habitRow.name,
          description: habitRow.description,
          emoji: habitRow.emoji,
          completed: numberToBoolean(habitRow.completed),
          frequency: habitRow.frequency,
          target: habitRow.target,
          createdAt: isoStringToDate(habitRow.createdAt),
          completedDates: habitDates
        };
      });

      return habits;
    } catch (error) {
      console.error('Error getting habits:', error);
      return [];
    }
  }

  static async updateHabit(habit: Habit): Promise<void> {
    if (!SQLiteService.db) throw new Error('Database not initialized');

    await SQLiteService.db.runAsync(
      `UPDATE habits 
       SET name = ?, description = ?, emoji = ?, completed = ?, frequency = ?, target = ?
       WHERE id = ?;`,
      [
        habit.name,
        habit.description || null,
        habit.emoji,
        booleanToNumber(habit.completed),
        habit.frequency,
        habit.target,
        habit?.id || null
      ]
    );
  }

  static async deleteHabit(habitId: string): Promise<void> {
    if (!SQLiteService.db) throw new Error('Database not initialized');

    await SQLiteService.db.runAsync(
      'DELETE FROM habits WHERE id = ?;',
      [habitId]
    );
  }

  static async addCompletedDate(habitId: string, date: Date = new Date()): Promise<void> {
    if (!SQLiteService.db) throw new Error('Database not initialized');

    const id = uuid();
    const createdAt = new Date();

    await SQLiteService.db.runAsync(
      `INSERT INTO habit_completed_dates (id, habit_id, completed_date, createdAt) 
       VALUES (?, ?, ?, ?);`,
      [
        id,
        habitId,
        dateToISOString(date),
        dateToISOString(createdAt)
      ]
    );

    await SQLiteService.db.runAsync(
      'UPDATE habits SET completed = 1 WHERE id = ?;',
      [habitId]
    );
  }

  static async removeCompletedDate(habitId: string, date: Date): Promise<void> {
    if (!SQLiteService.db) throw new Error('Database not initialized');

    await SQLiteService.db.runAsync(
      `DELETE FROM habit_completed_dates 
       WHERE habit_id = ? AND completed_date = ?;`,
      [
        habitId,
        dateToISOString(date)
      ]
    );

    const remainingDates = await SQLiteService.db.getFirstAsync(
      `SELECT COUNT(*) as count FROM habit_completed_dates WHERE habit_id = ?;`,
      [habitId]
    );

    // if (remainingDates && remainingDates.count === 0) {
    //   await SQLiteService.db.runAsync(
    //     'UPDATE habits SET completed = 0 WHERE id = ?;',
    //     [habitId]
    //   );
    // }
  }

  static async getHabitsCompletedOnDate(date: Date): Promise<Array<Habit>> {
    if (!SQLiteService.db) return [];

    try {
      const targetDate = date.toISOString().split('T')[0];

      const result = await SQLiteService.db.getAllAsync(
        `SELECT h.* 
         FROM habits h
         INNER JOIN habit_completed_dates hcd ON h.id = hcd.habit_id
         WHERE DATE(hcd.completed_date) = ?
         ORDER BY h.createdAt DESC;`,
        [targetDate]
      );

      return result.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        emoji: row.emoji,
        completed: numberToBoolean(row.completed),
        frequency: row.frequency,
        target: row.target,
        createdAt: isoStringToDate(row.createdAt),
        completedDates: []
      }));
    } catch (error) {
      console.error('Error getting habits completed on date:', error);
      return [];
    }
  }
  static async getHabitStats(habitId: string, days: number = 30): Promise<{ date: string, completed: boolean }[]> {
    if (!SQLiteService.db) return [];

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const result = await SQLiteService.db.getAllAsync(
        `SELECT 
           DATE(completed_date) as date,
           1 as completed
         FROM habit_completed_dates
         WHERE habit_id = ? AND completed_date >= ?
         UNION ALL
         SELECT 
           DATE(?) as date,
           0 as completed
         WHERE 0
         ORDER BY date DESC;`,
        [habitId, dateToISOString(startDate)]
      );

      return result.map((row: any) => ({
        date: row.date,
        completed: Boolean(row.completed)
      }));
    } catch (error) {
      console.error('Error getting habit stats:', error);
      return [];
    }
  }
}

export default SQLiteService;
