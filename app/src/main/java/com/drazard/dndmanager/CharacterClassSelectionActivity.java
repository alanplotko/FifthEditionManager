package com.drazard.dndmanager;

import android.content.Intent;
import android.os.Bundle;
import android.os.Parcelable;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;

public class CharacterClassSelectionActivity extends AppCompatActivity {

    private RecyclerView rv;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager llm;
    private Parcelable state;
    private static final String BUNDLE_RECYCLER_LAYOUT =
            "CharacterClassSelectionActivity.recycler.layout";
    private static final String BUNDLE_RECYCLER_EXPAND_LIST =
            "CharacterClassSelectionActivity.recycler.expandList";

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

    @Override
    public void onRestoreInstanceState(@Nullable Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);

        if(savedInstanceState != null)
        {
            Parcelable savedRecyclerLayoutState =
                    savedInstanceState.getParcelable(BUNDLE_RECYCLER_LAYOUT);
            // Restore layout scroll position
            rv.getLayoutManager().onRestoreInstanceState(savedRecyclerLayoutState);
            // Restore expand list
            ((ClassCardsAdapter) rv.getAdapter()).setExpandList(savedInstanceState
                    .getBooleanArray(BUNDLE_RECYCLER_EXPAND_LIST));
        }
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        // Save layout scroll position
        outState.putParcelable(BUNDLE_RECYCLER_LAYOUT, rv.getLayoutManager().onSaveInstanceState());
        // Save restore list
        outState.putBooleanArray(BUNDLE_RECYCLER_EXPAND_LIST,
                ((ClassCardsAdapter) rv.getAdapter()).getExpandList());
    }
}
