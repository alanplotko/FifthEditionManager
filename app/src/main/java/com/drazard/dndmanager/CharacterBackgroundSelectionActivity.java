package com.drazard.dndmanager;

import android.content.Intent;
import android.os.Bundle;
import android.os.Parcelable;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;

public class CharacterBackgroundSelectionActivity extends AppCompatActivity {

    private RecyclerView rv;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager llm;
    private Parcelable state;
    private static final String BUNDLE_RECYCLER_LAYOUT =
            "CharacterBackgroundSelectionActivity.recycler.layout";
    private static final String BUNDLE_RECYCLER_EXPAND_LIST =
            "CharacterBackgroundSelectionActivity.recycler.expandList";

    public static final int EDIT_FAIL = 9;
    public static final int EDIT_SUCCESS = 10;
    private DBHandler db = null;
    private Campaign mCampaign = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_background_selection);

        // Get campaign ID
        Intent mIntent = getIntent();
        long campaignId = mIntent.getLongExtra("campaignId", 0);
        boolean firstTime = mIntent.getBooleanExtra("firstTime", false);

        rv = (RecyclerView) findViewById(R.id.background_list);

        /**
         * Use this setting to improve performance if you know that changes
         * in content do not change the layout size of the RecyclerView.
         */
        // rv.setHasFixedSize(true);

        // Use a linear layout manager
        llm = new LinearLayoutManager(this);
        rv.setLayoutManager(llm);

        Toolbar toolbar = (Toolbar) findViewById(R.id.character_background_selection_toolbar);
        setSupportActionBar(toolbar);

        // Ensure campaign id is valid if editing
        if (!firstTime) {
            if (campaignId == 0) {
                setResult(EDIT_FAIL);
                this.finish();
                return;
            } else {
                getSupportActionBar().setTitle(getResources().getString(R.string.edit_background));
                int position = -1;
                db = DBHandler.getInstance(this);
                mCampaign = db.getCampaign(campaignId);
                String currentBackground = mCampaign.character.background;
                String backgrounds[] = getResources().getStringArray(R.array.character_background_options);
                for (int i = 0; i < backgrounds.length; i++) {
                    if (backgrounds[i].equals(currentBackground)) {
                        position = i;
                        break;
                    }
                }
                if (position != -1) {
                    rv.getLayoutManager().scrollToPosition(position);
                }
            }
        } else {
            db = DBHandler.getInstance(this);
            mCampaign = db.getCampaign(campaignId);
        }

        adapter = new BackgroundCardsAdapter(findViewById(R.id.background_list), mCampaign, db,
                firstTime);
        rv.setAdapter(adapter);
    }

    @Override
    public void onRestoreInstanceState(@Nullable Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);

        if(savedInstanceState != null) {
            Parcelable savedRecyclerLayoutState =
                    savedInstanceState.getParcelable(BUNDLE_RECYCLER_LAYOUT);
            // Restore layout scroll position
            rv.getLayoutManager().onRestoreInstanceState(savedRecyclerLayoutState);
            // Restore expand list
            ((BackgroundCardsAdapter) rv.getAdapter()).setExpandList(savedInstanceState
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
                ((BackgroundCardsAdapter) rv.getAdapter()).getExpandList());
    }
}