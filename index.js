/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// [추가] Headless JS 파일 import
import GeofenceHeadlessTask from './src/native/GeofenceHeadlessTask';

// [추가] Headless JS Task 등록
AppRegistry.registerHeadlessTask('GeofenceEvent', () => GeofenceHeadlessTask);

AppRegistry.registerComponent(appName, () => App);
