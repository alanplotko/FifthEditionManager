package com.drazard.dndmanager;

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

        // Set up character
        EditText fname = (EditText) findViewById(R.id.character_fname);
        EditText lname = (EditText) findViewById(R.id.character_lname);
        Character character = new Character(fname.getText().toString().trim(),
                lname.getText().toString().trim());
        campaign.setCharacter(character);

        // Set time for campaign creation and update
        long time = System.currentTimeMillis();
        campaign.setRawStartDate(time);
        campaign.setRawUpdateTime(time);

        // Save campaign and return to home activity
        DBHandler db = DBHandler.getInstance(this);
        db.addCampaign(campaign);
        this.finish();
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

        // Force validation on right hand side even if errors is already true
        errors |= validateViewGroup((ViewGroup) findViewById(R.id.activity_new_campaign));
        errors |= validateViewGroup((ViewGroup) findViewById(R.id.character_age_exp_section));
        errors |= validateViewGroup((ViewGroup) findViewById(R.id.character_measurements_section));

        return errors;
    }
}
