package com.drazard.ddmanager;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import java.util.List;

public class MainActivity extends AppCompatActivity {
    private RecyclerView rv;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager llm;
    private TextView placeholder;
    List<Campaign> campaigns; // The list of campaigns to manage in the activity

    public void updatePlaceholder(Boolean empty) {
        if (empty) {
            placeholder.setText(R.string.no_campaigns);
        } else {
            placeholder.setText("");
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = (Toolbar) findViewById(R.id.home_toolbar);
        setSupportActionBar(toolbar);

        rv = (RecyclerView) findViewById(R.id.campaign_list);
        placeholder = (TextView) findViewById(R.id.no_campaigns);

        /**
         * Use this setting to improve performance if you know that changes
         * in content do not change the layout size of the RecyclerView
         */
        // rv.setHasFixedSize(true);

        // Use a linear layout manager
        llm = new LinearLayoutManager(this);
        rv.setLayoutManager(llm);

        /**
         * Set up database call to get existing campaigns
         */
        DBHandler db = new DBHandler(this);
        campaigns = db.getAllCampaigns();
        updatePlaceholder(campaigns.isEmpty());

        adapter = new CampaignsAdapter(campaigns);
        rv.setAdapter(adapter);
    }

    /**
     * Set up home toolbar on activity
     */
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.home_toolbar, menu);
        return true;
    }

    /**
     * Listen to clicks on action buttons
     */
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.action_new_campaign:
                createCampaign();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    /**
     * Create a new campaign to keep track of.
     */
    public void createCampaign() {
        Intent intent = new Intent(this, NewCampaignActivity.class);
        startActivity(intent);
        /*Campaign campaign = new Campaign();
        Character character = new Character("Rael", "Holimion");
        character.setCharacterClass("rogue");
        campaign.setCharacter(character);

        long now = System.currentTimeMillis();
        campaign.setRawStartDate(now);
        campaign.setRawUpdateTime(now);

        DBHandler db = new DBHandler(this);
        db.addCampaign(campaign);
        campaigns.add(0, campaign);
        updatePlaceholder(campaigns.isEmpty());

        adapter.notifyDataSetChanged();*/
    }
}
