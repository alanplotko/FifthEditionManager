package com.drazard.dndmanager;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

public class NewCampaignActivity extends AppCompatActivity {
    public static final int EDIT_FAIL = 3;
    public static final int EDIT_SUCCESS = 4;
    public Campaign mCampaign = null;
    public RequiredSpinnerAdapter gender_adapter = null, alignment_adapter = null;
    DBHandler db = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_campaign);

        // Get campaign ID and check if user is editing or creating a new campaign activity
        Intent mIntent = getIntent();
        final long campaignId = mIntent.getLongExtra("campaignId", 0);
        final boolean firstTime = mIntent.getBooleanExtra("firstTime", true);

        // Set up spinners in advance in case we are editing
        // Bind spinners in activity
        Spinner gender_dropdown = (Spinner) findViewById(R.id.character_gender);
        Spinner alignment_dropdown = (Spinner) findViewById(R.id.character_alignment);

        // Associate options with corresponding spinner
        gender_adapter = new RequiredSpinnerAdapter(this,
                R.layout.item_spinner, getResources().getStringArray(R.array.gender_options));
        gender_dropdown.setAdapter(gender_adapter);
        alignment_adapter = new RequiredSpinnerAdapter(this,
                R.layout.item_spinner, getResources().getStringArray(R.array.alignment_options));
        alignment_dropdown.setAdapter(alignment_adapter);

        // End activity if campaign id was not passed when editing
        if (!firstTime) {
            if (campaignId == 0) {
                setResult(EDIT_FAIL);
                this.finish();
                return;
            } else {
                Toolbar mToolbar = (Toolbar) findViewById(R.id.new_campaign_toolbar);
                mToolbar.setTitle(R.string.edit_general_info);
                db = DBHandler.getInstance(this);
                mCampaign = db.getCampaign(campaignId);
                setUpEditScreen();
            }
        }

        // Set up save button
        Button saveButton = (Button) findViewById(R.id.btn_save_campaign);
        saveButton.setOnClickListener( new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                boolean errors = validateCampaign();
                if (errors) return;
                saveCampaign(campaignId, firstTime);
            }
        });
    }

    public void setUpEditScreen() {
        EditText player_name = (EditText) findViewById(R.id.player_name);
        EditText fname = (EditText) findViewById(R.id.character_fname);
        EditText lname = (EditText) findViewById(R.id.character_lname);
        Spinner gender = (Spinner) findViewById(R.id.character_gender);
        Spinner alignment = (Spinner) findViewById(R.id.character_alignment);
        EditText level = (EditText) findViewById(R.id.character_level);
        EditText height = (EditText) findViewById(R.id.character_height);
        EditText weight = (EditText) findViewById(R.id.character_weight);
        EditText age = (EditText) findViewById(R.id.character_age);
        EditText exp = (EditText) findViewById(R.id.character_exp);
        player_name.setText(mCampaign.playerName);
        fname.setText(mCampaign.character.firstName);
        lname.setText(mCampaign.character.lastName);
        gender.setSelection(gender_adapter.getPosition(mCampaign.character.gender));
        alignment.setSelection(alignment_adapter.getPosition(mCampaign.character.alignment));
        level.setText(Integer.toString(mCampaign.character.level));
        height.setText(mCampaign.character.height);
        weight.setText(mCampaign.character.weight);
        age.setText(mCampaign.character.age);
        exp.setText(Integer.toString(mCampaign.character.exp));
    }

    public boolean validateViewGroup(ViewGroup group) {
        boolean errors = false;
        for (int i = 0, count = group.getChildCount(); i < count; ++i) {
            View view = group.getChildAt(i);
            if (view instanceof EditText) {
                EditText field = (EditText) view;
                if (field.getText().toString().trim().equals("")) {
                    errors = true;
                    String field_name = field.getHint().toString().toLowerCase();
                    field.setError(field_name.substring(0, 1).toUpperCase() +
                            field_name.substring(1) + " required");
                }
            }
        }
        return errors;
    }

    public void saveCampaign(long existing_id, boolean firstTime) {
        if (db == null) {
            db = DBHandler.getInstance(this);
        }
        Character character;

        // Set up fields to extract information from
        EditText player_name = (EditText) findViewById(R.id.player_name);
        EditText fname = (EditText) findViewById(R.id.character_fname);
        EditText lname = (EditText) findViewById(R.id.character_lname);
        Spinner gender = (Spinner) findViewById(R.id.character_gender);
        Spinner alignment = (Spinner) findViewById(R.id.character_alignment);
        EditText level = (EditText) findViewById(R.id.character_level);
        EditText height = (EditText) findViewById(R.id.character_height);
        EditText weight = (EditText) findViewById(R.id.character_weight);
        EditText age = (EditText) findViewById(R.id.character_age);
        EditText exp = (EditText) findViewById(R.id.character_exp);

        // Initial set up for "campaign and character" set
        if (firstTime) {
            // Create empty set
            mCampaign = new Campaign();
            mCampaign.character = new Character(fname.getText().toString().trim(),
                    lname.getText().toString().trim());
        }

        // Update player name
        mCampaign.playerName = player_name.getText().toString().trim();

        // Update character information
        mCampaign.character.firstName = fname.getText().toString().trim();
        mCampaign.character.lastName = lname.getText().toString().trim();
        mCampaign.character.gender = gender.getSelectedItem().toString().trim();
        mCampaign.character.alignment = alignment.getSelectedItem().toString().trim();
        mCampaign.character.level = Integer.parseInt(level.getText().toString().trim());
        mCampaign.character.height = height.getText().toString().trim();
        mCampaign.character.weight = weight.getText().toString().trim();
        mCampaign.character.age = age.getText().toString().trim();
        mCampaign.character.exp = Integer.parseInt(exp.getText().toString().trim());

        if (!firstTime) {
            // Update existing set
            db.updateCampaign(mCampaign);
            Intent data = new Intent();
            data.putExtra("characterName", mCampaign.character.firstName + " "
                    + mCampaign.character.lastName);
            if (getParent() == null) {
                setResult(EDIT_SUCCESS, data);
            } else {
                getParent().setResult(EDIT_SUCCESS, data);
            }
            this.finish();
            return;
        }

        // Save campaign and proceed to the next step
        long campaignId = db.addCampaign(mCampaign);
        Intent next = new Intent(NewCampaignActivity.this,
                CharacterRaceSelectionActivity.class);
        next.putExtra("campaignId", campaignId);
        next.putExtra("firstTime", true);
        this.finish();
        startActivity(next);
    }

    public boolean validateCampaign() {
        boolean errors = false;

        // Set up fields for extracting input
        Spinner gender = (Spinner) findViewById(R.id.character_gender);
        Spinner alignment = (Spinner) findViewById(R.id.character_alignment);

        /**
         * Validate fields
         */
        if (gender.getSelectedItemPosition() == 0) {
            errors = true;
            RequiredSpinnerAdapter adapter = (RequiredSpinnerAdapter) gender.getAdapter();
            adapter.setError(gender.getSelectedView(),
                    NewCampaignActivity.this.getString(R.string.error_gender));
        }

        if (alignment.getSelectedItemPosition() == 0) {
            errors = true;
            RequiredSpinnerAdapter adapter = (RequiredSpinnerAdapter) alignment.getAdapter();
            adapter.setError(alignment.getSelectedView(),
                    NewCampaignActivity.this.getString(R.string.error_alignment));
        }

        /**
         * If level entered, check for valid range [1, 20]
         */
        EditText level = (EditText) findViewById(R.id.character_level);
        if (!level.getText().toString().isEmpty()) {
            int levelInt = Integer.parseInt(level.getText().toString());
            if (levelInt < 1 || levelInt > 20) {
                errors = true;
                level.setError("Invalid " + level.getHint().toString().toLowerCase());
            }
        }

        // Force validation on right hand side even if errors is already true
        errors |= validateViewGroup((ViewGroup) findViewById(R.id.activity_new_campaign));
        errors |= validateViewGroup((ViewGroup) findViewById(R.id.character_name_section));
        errors |= validateViewGroup((ViewGroup) findViewById(R.id.character_level_exp_section));
        errors |= validateViewGroup((ViewGroup) findViewById(R.id.character_measurements_section));

        return errors;
    }
}
