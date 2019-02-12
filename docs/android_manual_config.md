#### Manual linking
If your any reason you don want to link this project using 'react-native link', go to settings.gradle and add
```
include ':react-native-image-resizer'
project(':react-native-image-resizer').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-image-resizer/android')
```

Add project to your `app/build.gradle` file
```
dependencies {
  ...
  implementation project(':react-native-image-resizer')
  ...
}
```

import it at the top of your `MainApplication.java` file
```
import fr.bamlab.rnimageresizer.ImageResizerPackage;
```

then go the file that you build the ReactInstance and add the packager to it.

```
  ReactInstanceManager.Builder builder = ReactInstanceManager.builder()
                .setApplication(application)
                .setDefaultHardwareBackBtnHandler(application.getGAMActivity())
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .setCurrentActivity((Activity) application.getGAMActivity())
                .addPackage(new RealmReactPackage())
                .addPackage(new MainReactPackageWrapper())
                .addPackage(new StoreReactNativePackage())
                .addPackage(new ImageResizerPackage()) <------- (Add this package on the Builder list)
                .addPackage(gamCommunicationReactPackage);
```
