import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Student} from './Student';
import {Course} from './Course';
import {
  createCourseTable,
  createStudentTable,
  getCourses,
  getDBConnection,
  getStudents,
  getStudentsTakingCertainCourses,
  insertCourse,
  insertCourses,
  insertStudent,
  insertStudents,
} from './db-service';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import Snackbar from 'react-native-snackbar';

const HomePage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [certainStudents, setCertainStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const initDatabase = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createCourseTable(db);
      const c1 = new Course(1, 'Math');
      const c2 = new Course(2, 'Science');
      const c3 = new Course(3, 'Calculus');
      insertCourse(db, c1);
      insertCourse(db, c2);
      insertCourse(db, c3);

      await createStudentTable(db);
      const s1 = new Student(101, 'Marc', 1);
      const s2 = new Student(201, 'Jin', 3);
      const s3 = new Student(412, 'Austin', 11);
      insertStudent(db, s1);
      insertStudent(db, s2);
      insertStudent(db, s3);

      const result1 = await getStudents(db);
      setStudents(result1);

      const result2 = await getCourses(db);
      setCourses(result2);

      const result3 = await getStudentsTakingCertainCourses(db, '1');
      setCertainStudents(result3);
    } catch (error) {
      Snackbar.show({
        text: 'Error loading' + error,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  }, []);

  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <View>
      <Text style={styles.textBold}>Courses</Text>
      <FlatList
        style={{
          borderBottomWidth: 1,
          borderColor: 'grey',
          paddingBottom: 10,
        }}
        data={courses}
        renderItem={({item}) => (
          <Text>
            {item.id} {item.subject}
          </Text>
        )}
        keyExtractor={(item, index) => 'key' + item.id}></FlatList>

      <Text style={styles.textBold}>Students</Text>
      <FlatList
        style={{borderBottomWidth: 1, borderColor: 'grey', paddingBottom: 10}}
        data={students}
        renderItem={({item}) => (
          <Text>
            {item.id} {item.name} {item.courseid}
          </Text>
        )}
        keyExtractor={(item, index) => 'key' + item.id}></FlatList>

      <Text style={styles.textBold}>Certain Students</Text>
      <FlatList
        style={{borderBottomWidth: 1, borderColor: 'grey'}}
        data={certainStudents}
        renderItem={({item}) => (
          <Text>
            {item.id} {item.name} {item.courseid}
          </Text>
        )}
        keyExtractor={(item, index) => 'key' + item.id}></FlatList>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  textBold: {
    fontWeight: 'bold',
  },
});
