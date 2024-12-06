---
hide_title: true
sidebar_position: 8
sidebar_label: 系统层级调用
---

## 打开手电筒
启动类
```java
package com.dshvv.myapplication;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;


public class MainActivity extends AppCompatActivity {
    FlashUtil ft = new FlashUtil();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    /*
     * 按钮点击事件
     */
    public void buttonClick(View view) {
        ft.switchFlash(this);
    }
}
```

手电筒工具类
```java
package com.dshvv.myapplication;
import android.annotation.TargetApi;
import android.content.Context;
import android.hardware.camera2.CameraManager;
import android.os.Build;

/*
 * 手电筒（开启闪光灯）工具类
 * 使用前，可能需要先申请闪光灯权限 <uses-permission android:name="android.permission.FLASHLIGHT" />
 * 部分手机需要摄像头权限： <uses-permission android:name="android.permission.CAMERA" /> 注：注意android5.0以上权限调用
 * 使用前，请先用hasFlashlight()方法判断设备是否有闪光灯
 * 务必在activity或fragment的onDestroy()方法里调用lightsOff()方法，确保Camera被释放
 *
 * 使用方法
 *  开启sos:new FlashlightUtils().sos()
 *  开启闪光灯: new FlashlightUtils().lightsOn()
 */
public class FlashUtil {
    private Boolean isOpen = false;
    private CameraManager manager ;

    /*
    * 开关手电筒（安卓6.0以上）
    * return 返回当前闪光灯开启状态
    */
    @TargetApi(Build.VERSION_CODES.M)
    protected boolean switchFlash(Context context){
        try{
            manager = (CameraManager) context.getSystemService(Context.CAMERA_SERVICE);
            if(isOpen){
                manager.setTorchMode("0", false);// "0"是主闪光灯
                this.isOpen = false;
            }else{
                manager.setTorchMode("0", true);
                this.isOpen = true;
            }
        }catch(Exception e){}
        return this.isOpen;
    }
}
```