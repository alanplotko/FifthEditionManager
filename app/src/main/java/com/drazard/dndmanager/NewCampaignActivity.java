package com.drazard.dndmanager;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

public class NewCampaignActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_campaign);

        // Bind spinners in activity
        Spinner gender_dropdown = (Spinner) findViewById(R.id.character_gender);
        Spinner alignment_dropdown = (Spinner) findViewById(R.id.character_alignment);

        // Associate options with corresponding spinner
        RequiredSpinnerAdapter gender_adapter = new RequiredSpinnerAdapter(this,
                R.layout.spinner_item, getResources().getStringArray(R.array.gender_options));
        gender_dropdown.setAdapter(gender_adapter);
        RequiredSpinnerAdapter alignment_adapter = new RequiredSpinnerAdapter(this,
                R.layout.spinner_item, getResources().getStringArray(R.array.alignment_options));
        alignment_dropdown.setAdapter(alignment_adapter);

        // Set up save button
        Button saveButton = (Button) findViewById(R.id.btn_save_campaign);
        saveButton.setOnClickListener( new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                boolean errors = validateCampaign();
                if (errors) return;
                saveCampaign();
            }
        });
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

    public void saveCampaign() {
        // Create empty campaign
        Campaign campaign = new Campaign();
        EditText player_name = (EditText) findViewById(R.id.player_name);
        campaign.setPlayerName(player_name.getText().toString().trim());

        // Set up character
        EditText fname = (EditText) findViewById(R.id.character_fname);
        EditText lname = (EditText) findViewById(R.id.character_lname);
        Spinner gender = (Spinner) findViewById(R.id.character_gender);
        Spinner alignment = (Spinner) findViewById(R.id.character_alignment);
        EditText level = (EditText) findViewById(R.id.character_level);
        EditText height = (EditText) findViewById(R.id.character_height);
        EditText weight = (EditText) findViewById(R.id.character_weight);
        EditText age = (EditText) findViewById(R.id.character_age);
        EditText exp = (EditText) findViewById(R.id.character_exp);

        Character character = new Character(fname.getText().toString().trim(),
                lname.getText().toString().trim());
        character.setCharacterLevel(Integer.parseInt(level.getText().toString().trim()));
        character.setGender(gender.getSelectedItem().toString().trim());
        character.setAlignment(alignment.getSelectedItem().toString().trim());
        character.setHeight(height.getText().toString().trim());
        character.setWeight(weight.getText().toString().trim());
        character.setAge(age.getText().toString().trim());
        character.setExp(Integer.parseInt(exp.getText().toString().trim()));
        campaign.setCharacter(character);

        // Save campaign and return to home activity
        DBHandler db = DBHandler.getInstance(this);
        long campaign_id = db.addCampaign(campaign);
        Intent nextStep = new Intent(NewCampaignActivity.this,
                CharacterRaceSelectionActivity.class);
        nextStep.putExtra("campaign_id", campaign_id);
        this.finish();
        startActivity(nextStep);
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
