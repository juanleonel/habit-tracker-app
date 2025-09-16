import * as SQLite from 'expo-sqlite';
import { Habit } from '../types';

const db = SQLite.openDatabase('habits.db');

// Helper to serialize/deserialize completedDates
const serializeDates = (dates: Date[]) => JSON.stringify(dates.map(d => d.toISOString()));
const deserializeDates = (json: string) => {
  try {
    return JSON.parse(json).map((d: string) => new Date(d));
  } catch {
    return [];
  }
};

export const HabitService = {
  init: () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS habits (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT,
          description TEXT,
          emoji TEXT,
          completed INTEGER,
          frequency TEXT,
          target TEXT,
          createdAt TEXT,
          completedDates TEXT
        );`
      );
    });
  },

  addHabit: (habit: Habit, callback?: () => void) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO habits (id, name, description, emoji, completed, frequency, target, createdAt, completedDates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          habit.id,
          habit.name,
          habit.description,
          habit.emoji,
          habit.completed ? 1 : 0,
          habit.frequency,
          habit.target,
          habit.createdAt.toISOString(),
          serializeDates(habit.completedDates),
        ],
        () => callback && callback(),
        (_, error) => { console.error(error); return false; }
      );
    });
  },

  getHabits: (callback: (habits: Habit[]) => void) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM habits;`,
        [],
        (_, { rows }) => {
          const habits: Habit[] = [];
          for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            habits.push({
              id: row.id,
              name: row.name,
              description: row.description,
              emoji: row.emoji,
              completed: !!row.completed,
              frequency: row.frequency,
              target: row.target,
              createdAt: new Date(row.createdAt),
              completedDates: deserializeDates(row.completedDates),
            });
          }
          callback(habits);
        },
        (_, error) => { console.error(error); return false; }
      );
    });
  },

  updateHabit: (habit: Habit, callback?: () => void) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE habits SET name=?, description=?, emoji=?, completed=?, frequency=?, target=?, createdAt=?, completedDates=? WHERE id=?;`,
        [
          habit.name,
          habit.description,
          habit.emoji,
          habit.completed ? 1 : 0,
          habit.frequency,
          habit.target,
          habit.createdAt.toISOString(),
          serializeDates(habit.completedDates),
          habit.id,
        ],
        () => callback && callback(),
        (_, error) => { console.error(error); return false; }
      );
    });
  },

  deleteHabit: (id: string, callback?: () => void) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM habits WHERE id=?;`,
        [id],
        () => callback && callback(),
        (_, error) => { console.error(error); return false; }
      );
    });
  },
};
