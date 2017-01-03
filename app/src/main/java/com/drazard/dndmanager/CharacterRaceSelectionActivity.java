package com.drazard.dndmanager;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

public class CharacterRaceSelectionActivity extends AppCompatActivity {

    /**
     * The {@link android.support.v4.view.PagerAdapter} that will provide
     * fragments for each of the sections. We use a
     * {@link FragmentPagerAdapter} derivative, which will keep every
     * loaded fragment in memory. If this becomes too memory intensive, it
     * may be best to switch to a
     * {@link android.support.v4.app.FragmentStatePagerAdapter}.
     */
    private SectionsPagerAdapter mSectionsPagerAdapter;

    /**
     * The {@link ViewPager} that will host the section contents.
     */
    private ViewPager mViewPager;

    public String[] character_races;
    public long campaign_id;
    public boolean first_time;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_race_selection);

        // Get campaign ID
        Intent mIntent = getIntent();
        campaign_id = mIntent.getIntExtra("campaign_id", 0);
        first_time = mIntent.getBooleanExtra("first_time", false);

        // Set up character race options
        if (character_races == null) {
            character_races = getResources().getStringArray(R.array.character_race_options);
        }

        Toolbar toolbar = (Toolbar) findViewById(R.id.character_race_selection_toolbar);
        setSupportActionBar(toolbar);
        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.container);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                selectCharacterRace(character_races[mViewPager.getCurrentItem()]);
            }
        });
    }

    public void selectCharacterRace(String selected) {
        DBHandler db = DBHandler.getInstance(this);
        Campaign campaign = db.getCampaign(campaign_id);
        Character character = campaign.getCharacter();
        character.setCharacterRace(selected);
        campaign.setCharacter(character);

        // Save campaign and proceed to next activity
        if (!first_time) {
            db.updateCampaign(campaign);
            this.finish();
            Snackbar.make(findViewById(R.id.campaign_list),
                    getResources().getString(R.string.finish_select_race),
                    Snackbar.LENGTH_LONG).show();
        } else {
            campaign.setStatus(2);
            db.updateCampaign(campaign);
            Intent next = new Intent(this, CharacterClassSelectionActivity.class);
            next.putExtra("campaign_id", (int) (campaign_id + 0));
            next.putExtra("first_time", true);
            this.finish();
            startActivity(next);
        }
    }

    public String getCharacterRaceTitle(int position) {
        String title;
        try {
            title = character_races[position];
        } catch (Exception e) {
            title = getResources().getString(R.string.no_character_race_title);
        }
        return title;
    }

    public String getCharacterRaceDescription(int position) {
        int stringId;
        // Attempt to fetch description for given character race
        try {
            String fieldName = "race_" + character_races[position].toLowerCase().replace("-", "_");
            stringId = R.string.class.getField(fieldName).getInt(null);
        } catch (Exception e) {
            stringId = R.string.no_character_race_description;
        }
        return getResources().getString(stringId);
    }

    /**
     * A placeholder fragment containing a simple view.
     */
    public static class PlaceholderFragment extends Fragment {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_number";
        private static final String ARG_SECTION_TITLE = "section_title";

        public PlaceholderFragment() {}

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static PlaceholderFragment newInstance(String sectionTitle, int sectionNumber) {
            PlaceholderFragment fragment = new PlaceholderFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            args.putString(ARG_SECTION_TITLE, sectionTitle);
            fragment.setArguments(args);
            return fragment;
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_race_selection, container,
                    false);
            TextView textView = (TextView) rootView.findViewById(R.id.character_race);
            String test = getArguments().getString(ARG_SECTION_TITLE);
            textView.setText(getArguments().getString(ARG_SECTION_TITLE));
            return rootView;
        }
    }

    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            // Return a PlaceholderFragment (defined as a static inner class below).
            return PlaceholderFragment.newInstance(getCharacterRaceTitle(position), position);
        }

        @Override
        public int getCount() {
            return character_races.length;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            return getCharacterRaceTitle(position);
        }
    }
}
