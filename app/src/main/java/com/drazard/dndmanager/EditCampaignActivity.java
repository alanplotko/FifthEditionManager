package com.drazard.dndmanager;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.Snackbar;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class EditCampaignActivity extends AppCompatActivity {
    public View mView = null;
    public Intent mIntent = null;
    public Intent next = null;
    public final int GET_EDIT_RESULT = 2;

    public void moveToActivity(View view, Class cls) {
        Context context = view.getContext();
        next = new Intent(context, cls);
        next.putExtras(mIntent);
        startActivityForResult(next, GET_EDIT_RESULT);
    }

    @Override
    public void onActivityResult(final int reqCode, final int resCode, final Intent data) {
        int message = -1;
        if (reqCode == GET_EDIT_RESULT) {
            switch (resCode) {
                case NewCampaignActivity.EDIT_FAIL:
                case CharacterRaceSelectionActivity.EDIT_FAIL:
                case CharacterClassSelectionActivity.EDIT_FAIL:
                case CharacterBackgroundSelectionActivity.EDIT_FAIL:
                    message = R.string.error_missing_campaign_id;
                    break;
                case NewCampaignActivity.EDIT_SUCCESS:
                    message = R.string.finish_edit_campaign;
                    break;
                case CharacterRaceSelectionActivity.EDIT_SUCCESS:
                    message = R.string.finish_select_race;
                    break;
                case CharacterClassSelectionActivity.EDIT_SUCCESS:
                    message = R.string.finish_select_class;
                    break;
                case CharacterBackgroundSelectionActivity.EDIT_SUCCESS:
                    message = R.string.finish_select_background;
                    break;
                // If resCode gets set to 0, the user probably pressed back
                case RESULT_CANCELED:
                    break;
                default:
                    message = R.string.error_general;
                    break;
            }
        }
        if (message != -1) {
            Snackbar snackbar = Snackbar.make(mView, getResources().getString(message),
                    Snackbar.LENGTH_LONG);
            View snackbarView = snackbar.getView();
            snackbarView.setBackgroundColor(ContextCompat.getColor(mView.getContext(),
                    R.color.colorPrimary));
            TextView textView = (TextView) snackbarView
                    .findViewById(android.support.design.R.id.snackbar_text);
            textView.setTextColor(ContextCompat.getColor(mView.getContext(), R.color.primaryText));
            snackbar.show();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_campaign);

        // Set up intent and view
        mIntent = getIntent();
        mView = findViewById(R.id.edit_general_info_btn);


        // Set up edit buttons
        Button infoButton = (Button) findViewById(R.id.edit_general_info_btn);
        Button raceButton = (Button) findViewById(R.id.edit_race_btn);
        Button classButton = (Button) findViewById(R.id.edit_class_btn);
        Button backgroundButton = (Button) findViewById(R.id.edit_background_btn);
        infoButton.setOnClickListener( new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                moveToActivity(view, NewCampaignActivity.class);
            }
        });
        raceButton.setOnClickListener( new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                moveToActivity(view, CharacterRaceSelectionActivity.class);
            }
        });
        classButton.setOnClickListener( new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                moveToActivity(view, CharacterClassSelectionActivity.class);
            }
        });
        backgroundButton.setOnClickListener( new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                moveToActivity(view, CharacterBackgroundSelectionActivity.class);
            }
        });
    }
}
