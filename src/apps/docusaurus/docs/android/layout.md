---
hide_title: true
sidebar_position: 7
sidebar_label: 基础布局
---

## 动态渲染元素

xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:id="@+id/activity_main">
</LinearLayout>
```

java
```java
package com.dshvv.myapplication;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        this.insertText();
    }

    private void insertText() {
        LinearLayout activityMain = (LinearLayout) findViewById(R.id.activity_main);
        for (int i = 0; i < 10; i++) {
            TextView tv = new TextView(this);
            tv.setWidth(300);
            tv.setHeight(200);
            tv.setBackgroundColor(android.graphics.Color.BLUE);
            tv.setText("示例文本框");

            // 设置边距
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            layoutParams.setMargins(10,10,10,10);//4个参数按顺序分别是左上右下
            tv.setLayoutParams(layoutParams);

            // 添加到页面
            activityMain.addView(tv);
        }
    }
}

// 边距参考：https://blog.csdn.net/qq_28002747/article/details/107099077?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromBaidu-1.not_use_machine_learn_pai&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromBaidu-1.not_use_machine_learn_pai
```