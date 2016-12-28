package com.drazard.ddmanager;

import android.content.Context;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.TextView;

public class RequiredSpinnerAdapter extends ArrayAdapter<String> {
    private String[] objects;

    public RequiredSpinnerAdapter(Context context, int textViewResourceId, String[] objects) {
        super(context, textViewResourceId, objects);
        this.objects = objects;
    }

    /**
     * Required spinner adapter implements setError method
     * to set an error message and icon if deemed invalid input.
     *
     * E.g. selecting the default option ("Select X"), which is
     * present for display purposes, is deemed invalid input.
     */
    public void setError(View v, CharSequence s) {
        TextView name = (TextView) v;
        name.setError(s);
    }
}
