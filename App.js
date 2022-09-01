/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import Realm from 'realm';
import {taskSchema} from './src/model/Schema';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    realmConnection();
  }, []);

  //open realm connection
  const realmConnection = async () => {
    const realm = await Realm.open({
      path: 'myrealm',
      schema: [taskSchema],
    });
    console.log('REALM OPEN ', realm);
    writeTasks(realm);
  };

  const writeTasks = realm => {
    // create tasks
    let task1, task2;
    realm.write(() => {
      task1 = realm.create('Tasks', {
        _id: 1,
        name: 'go grocery shopping',
        status: 'Open',
      });
      task2 = realm.create('Tasks', {
        _id: 2,
        name: 'go exercise',
        status: 'Open',
      });
      console.log(`created two tasks: ${task1.name} & ${task2.name}`);
    });

    //read tasks
    // query realm for all instances of the "Task" type.
    const tasks = realm.objects('Tasks');
    console.log('TASKS ', tasks);
    console.log(`The lists of tasks are: ${tasks.map(task => task.name)}`);

    // get single task
    const task = realm.objectForPrimaryKey('Tasks', 2);
    console.log(`${task.name}, ${task.status}`);

    // modify the task
    realm.write(() => {
      const task = realm.objectForPrimaryKey('Tasks', 2);
      console.log(`${task.name}, ${task.status}`);
      task.status = 'Closed';
    });

    //delete task
    realm.write(() => {
      let task = realm.objectForPrimaryKey('Tasks', 1);
      if (task == undefined) {
        console.log('Already deleted.');
      } else realm.delete(task);
      task = null;
    });

    //close the realm connection
    realm.close();
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text style={{color: isDarkMode ? '#fff' : 'green', fontSize: 25}}>
        Mongo DB Realm CRUD
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
