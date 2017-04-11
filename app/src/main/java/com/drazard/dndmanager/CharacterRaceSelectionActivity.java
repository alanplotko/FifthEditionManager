package com.drazard.dndmanager;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.content.ContextCompat;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.Html;
import android.text.Spanned;
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

    public String[] characterRaces;
    public long campaignId;
    public boolean firstTime;

    public static final int EDIT_FAIL = 5;
    public static final int EDIT_SUCCESS = 6;
    public Campaign mCampaign = null;
    public DBHandler db = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_race_selection);

        // Get campaign ID
        Intent mIntent = getIntent();
        campaignId = mIntent.getLongExtra("campaignId", 0);
        firstTime = mIntent.getBooleanExtra("firstTime", false);

        // Set up character race options
        if (characterRaces == null) {
            characterRaces = getResources().getStringArray(R.array.character_race_options);
        }

        // End activity if campaign id was not passed when editing
        if (!firstTime) {
            if (campaignId == 0) {
                setResult(EDIT_FAIL);
                this.finish();
                return;
            }
        }

        Toolbar toolbar = (Toolbar) findViewById(R.id.character_race_selection_toolbar);
        setSupportActionBar(toolbar);
        if (!firstTime) {
            getSupportActionBar().setTitle(getResources().getString(R.string.edit_race));
        }

        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.race_selection_container);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        db = DBHandler.getInstance(this);
        mCampaign = db.getCampaign(campaignId);
        int currentPos = 0;
        String currentRace = mCampaign.character.race;
        for (int i = 0; i < characterRaces.length; i++) {
            if (characterRaces[i].equals(currentRace)) {
                currentPos = i;
                break;
            }
        }
        mViewPager.setCurrentItem(currentPos);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                selectCharacterRace(characterRaces[mViewPager.getCurrentItem()]);
            }
        });
    }

    public void selectCharacterRace(String selected) {
        mCampaign = db.getCampaign(campaignId);
        mCampaign.character.race = selected;

        // Save campaign and proceed to next activity
        if (!firstTime) {
            db.updateCampaign(mCampaign);
            if (getParent() == null) {
                setResult(EDIT_SUCCESS);
            } else {
                getParent().setResult(EDIT_SUCCESS);
            }
            this.finish();
        } else {
            mCampaign.status = 2;
            db.updateCampaign(mCampaign);
            Intent next = new Intent(this, CharacterClassSelectionActivity.class);
            next.putExtra("campaignId", campaignId);
            next.putExtra("firstTime", true);
            this.finish();
            startActivity(next);
        }
    }

    public String getCharacterRaceTitle(int position) {
        String title;
        try {
            title = characterRaces[position];
        } catch (Exception e) {
            title = getResources().getString(R.string.no_character_race_title);
        }
        return title;
    }

    public String getCharacterRaceDetails(int position) {
        int stringId;
        // Attempt to fetch description for given character race
        try {
            String fieldName = "race_" + characterRaces[position].toLowerCase().replace("-", "_")
                    + "_details";
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
        private static final String ARG_POSITION = "position";
        private static final String ARG_RACE_NAME = "race_name";
        private static final String ARG_RACE_DETAILS = "race_details";

        public PlaceholderFragment() {}

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static PlaceholderFragment newInstance(String race, String details, int position) {
            PlaceholderFragment fragment = new PlaceholderFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_POSITION, position);
            args.putString(ARG_RACE_NAME, race);
            args.putString(ARG_RACE_DETAILS, details);
            fragment.setArguments(args);
            return fragment;
        }

        @SuppressWarnings("deprecation")
        public static Spanned fromHtml(String html){
            Spanned result;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                result = Html.fromHtml(html,Html.FROM_HTML_MODE_LEGACY);
            } else {
                result = Html.fromHtml(html);
            }
            return result;
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_race_selection, container,
                    false);
            TextView name_view = (TextView) rootView.findViewById(R.id.character_race_name);
            TextView details_view = (TextView) rootView.findViewById(R.id.character_race_details);

            String character_race = getArguments().getString(ARG_RACE_NAME);
            String race_details = getArguments().getString(ARG_RACE_DETAILS);

            name_view.setText(character_race);
            details_view.setText(this.fromHtml(race_details));


            // Set background for current fragment's character race
            try {
                int drawableId = R.drawable.class.getField("full_background_" +
                        character_race.toLowerCase().replace("-", "_")).getInt(null);
                rootView.setBackground(ContextCompat.getDrawable(inflater.getContext(),
                        drawableId));
            } catch (Exception e) {} // Do not set custom background if image not found

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
            return PlaceholderFragment.newInstance(
                    getCharacterRaceTitle(position),
                    getCharacterRaceDetails(position),
                    position);
        }

        @Override
        public int getCount() {
            return characterRaces.length;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            return getCharacterRaceTitle(position);
        }
    }
}
