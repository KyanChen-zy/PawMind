import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './main-tabs';
import { AddPetScreen } from '../screens/profile/add-pet-screen';
import { HealthMetricDetailScreen } from '../screens/health/health-metric-detail-screen';
import { HealthRecordListScreen } from '../screens/health/health-record-list-screen';
import { HealthRecordFormScreen } from '../screens/health/health-record-form-screen';
import { VaccinationListScreen } from '../screens/health/vaccination-list-screen';
import { VaccinationFormScreen } from '../screens/health/vaccination-form-screen';
import { DeviceListScreen } from '../screens/device/device-list-screen';
import { DeviceDetailScreen } from '../screens/device/device-detail-screen';
import { DeviceBindFlowScreen } from '../screens/device/device-bind-flow-screen';
import { DeviceShopScreen } from '../screens/device/device-shop-screen';
import { HealthQAScreen } from '../screens/care-ai/health-qa-screen';
import { DiagnosisScreen } from '../screens/care-ai/diagnosis-screen';
import { DiagnosisResultScreen } from '../screens/care-ai/diagnosis-result-screen';
import { DailyTipScreen } from '../screens/care-ai/daily-tip-screen';

const Stack = createNativeStackNavigator();

export function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AddPet" component={AddPetScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HealthMetricDetail" component={HealthMetricDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HealthRecordList" component={HealthRecordListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HealthRecordForm" component={HealthRecordFormScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VaccinationList" component={VaccinationListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VaccinationForm" component={VaccinationFormScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DeviceList" component={DeviceListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DeviceBindFlow" component={DeviceBindFlowScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DeviceShop" component={DeviceShopScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HealthQA" component={HealthQAScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Diagnosis" component={DiagnosisScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DiagnosisResult" component={DiagnosisResultScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DailyTip" component={DailyTipScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
