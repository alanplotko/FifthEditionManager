package com.drazard.dndmanager;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;

public class CharacterClassSelectionActivity extends AppCompatActivity {

    private RecyclerView rv;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager llm;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_class_selection);

        Toolbar toolbar = (Toolbar) findViewById(R.id.character_class_selection_toolbar);
        setSupportActionBar(toolbar);

        rv = (RecyclerView) findViewById(R.id.class_list);

        /**
         * Use this setting to improve performance if you know that changes
         * in content do not change the layout size of the RecyclerView.
         */
        // rv.setHasFixedSize(true);

        // Use a linear layout manager
        llm = new LinearLayoutManager(this);
        rv.setLayoutManager(llm);

        // Get campaign ID
        Intent mIntent = getIntent();
        int campaign_id = mIntent.getIntExtra("campaign_id", 0);
        boolean first_time = mIntent.getBooleanExtra("first_time", false);

        adapter = new ClassCardsAdapter(findViewById(R.id.class_list), campaign_id, first_time);
        rv.setAdapter(adapter);
    }
}
