import { Text, View } from 'react-native';
import Providers from './providers';

export default function Index() {
  return (
    <Providers>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home</Text>
      </View>
    </Providers>
  );
}


