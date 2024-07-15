import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { Student } from './Student'
import { Course } from './Course';

const tableNameStudent = 'student';
const tableNameCourse = 'course';
const tableNameUniversity = 'university'

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'fake17.db', location: 'default' });
};

export const createStudentTable = async (db: SQLiteDatabase) => {

  const query = `CREATE TABLE IF NOT EXISTS ${tableNameStudent}(
        id INTEGER NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        courseid INTEGER NOT NULL,
        FOREIGN KEY (courseid) REFERENCES course(id)
    );`;

    await db.executeSql(query);
}

export const createCourseTable = async (db : SQLiteDatabase) =>{
  
  const query = `CREATE TABLE IF NOT EXISTS ${tableNameCourse}(
    id INTEGER NOT NULL PRIMARY KEY,
    subject TEXT NOT NULL
       );`;
    await db.executeSql(query);
}

export const getStudents = async (db: SQLiteDatabase): Promise<Student[]> => {
  try {
    const students: Student[] = [];
    const results = await db.executeSql(`SELECT rowid as id,name,courseid FROM ${tableNameStudent} ORDER BY id ASC`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        students.push(result.rows.item(index))
      }
    });
    return students;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get students' + error);
  }
};


export const getCourses = async (db: SQLiteDatabase): Promise<Course[]> => {
    try {
      const courses: Course[] = [];
      const results = await db.executeSql(`SELECT rowid as id,subject FROM ${tableNameCourse} ORDER BY id ASC`);
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          courses.push(result.rows.item(index))
        }
      });
      return courses;
    } catch (error) {
      console.error(error);
      throw Error('Failed to get courses');
    }
  };

  
export const getStudentsTakingCertainCourses = async (db: SQLiteDatabase, courseid: string): Promise<Student[]> => {
  try {
    const students: Student[] = [];
    const results = await db.executeSql(`SELECT rowid as id,name,courseid FROM ${tableNameStudent} WHERE courseid=` + courseid + ` ORDER BY id ASC`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        students.push(result.rows.item(index))
      }
    });
    return students;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get courses');
  }
};

export const insertCourses = async (db: SQLiteDatabase, courses: Course[]) => {
    const insertQuery =
    `INSERT OR REPLACE INTO ${tableNameCourse}(id, subject) values` +
    courses.map(i => `(${i.id}, '${i.subject}' `).join(',');
    return db.executeSql(insertQuery);
  };

  export const insertCourse = async (db: SQLiteDatabase, course: Course) => {
    const insertQuery =
    `INSERT OR REPLACE INTO ${tableNameCourse}(id, subject) values` +
    `(${course.id}, '${course.subject}')`;
    return db.executeSql(insertQuery);
  };
  export const insertStudents = async (db: SQLiteDatabase, students: Student[]) => {
    const insertQuery =
    `INSERT OR REPLACE INTO ${tableNameStudent}(id, subject, courseid) values` +
    students.map(i => `(${i.id},'${i.name}','${i.courseid}'`).join(',');
    return db.executeSql(insertQuery);
  };
  export const insertStudent = async (db: SQLiteDatabase, student: Student) => {
    const insertQuery =
    `INSERT OR REPLACE INTO ${tableNameStudent}(id, name, courseid) values` +
    `(${student.id},'${student.name}',${student.courseid})`;
    return db.executeSql(insertQuery);
  };
