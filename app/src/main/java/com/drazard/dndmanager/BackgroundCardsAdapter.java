package com.drazard.dndmanager;

import android.animation.ObjectAnimator;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.design.widget.Snackbar;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.text.Html;
import android.text.Spanned;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

public class BackgroundCardsAdapter extends RecyclerView.Adapter<BackgroundCardsAdapter.BackgroundCardViewHolder> {
    private String[] backgrounds;
    private boolean[] expandList;
    private long campaignId;
    private boolean firstTime;
    private Campaign current;
    private DBHandler db;

    public boolean[] getExpandList() {
        return this.expandList;
    }

    public void setExpandList(boolean[] expandListIn) {
        this.expandList = expandListIn;
    }

    public static class BackgroundCardViewHolder extends RecyclerView.ViewHolder {
        private CardView card;

        /**
         * Card details
         */
        private final Context context;
        private TextView name;
        private TextView description;
        private ImageView background_icon;
        private TextView details;
        private ImageView expand_icon;
        private Button select_btn;

        public BackgroundCardViewHolder(View view) {
            super(view);
            context = view.getContext();
            card = (CardView) view.findViewById(R.id.background_card);
            name = (TextView) view.findViewById(R.id.background_name);
            description = (TextView) view.findViewById(R.id.background_description);
            background_icon = (ImageView) view.findViewById(R.id.background_icon);
            details = (TextView) view.findViewById(R.id.background_details);
            expand_icon = (ImageView) view.findViewById(R.id.background_details_expand_icon);
            select_btn = (Button) view.findViewById(R.id.btn_select_background);
        }
    }

    // Pass list of campaigns to adapter
    public BackgroundCardsAdapter(View v, long campaignId, boolean firstTime) {
        this.backgrounds = v.getResources().getStringArray(R.array.character_background_options);
        if (this.expandList == null) {
            this.expandList = new boolean[this.backgrounds.length];
        }
        this.campaignId = campaignId;
        this.firstTime = firstTime;
        this.db = DBHandler.getInstance(v.getContext());
        this.current = db.getCampaign(this.campaignId);
    }

    // Create new views (invoked by the layout manager)
    @Override
    public BackgroundCardViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View v = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.item_background_card, viewGroup, false);
        BackgroundCardViewHolder vh = new BackgroundCardViewHolder(v);
        return vh;
    }

    public String getCharacterBackgroundDescription(Context c, int pos) {
        int stringId;
        // Attempt to fetch description for given character background
        try {
            String fieldName = "background_" + this.backgrounds[pos].toLowerCase();
            stringId = R.string.class.getField(fieldName).getInt(null);
        } catch (Exception e) {
            stringId = R.string.no_character_background_description;
        }
        return c.getResources().getString(stringId);
    }

    public String getCharacterBackgroundDetails(Context c, int pos) {
        int stringId;
        // Attempt to fetch additional details for given character background
        try {
            String fieldName = "background_" + this.backgrounds[pos].toLowerCase() + "_details";
            stringId = R.string.class.getField(fieldName).getInt(null);
        } catch (Exception e) {
            stringId = R.string.no_character_class_details;
        }
        return c.getResources().getString(stringId);
    }

    public void updateVisibilityState(BackgroundCardViewHolder vh, int position) {
        if (expandList[position]) {
            vh.details.setVisibility(View.VISIBLE);
            vh.select_btn.setVisibility(View.VISIBLE);
            vh.expand_icon.setImageResource(R.drawable.ic_expand_less);
        } else {
            vh.details.setVisibility(View.GONE);
            vh.select_btn.setVisibility(View.GONE);
            vh.expand_icon.setImageResource(R.drawable.ic_expand_more);
        }
    }

    public void toggleVisibilityState(BackgroundCardViewHolder vh, int position) {
        // Toggle state
        expandList[position] = !expandList[position];

        // Update visibility accordingly
        updateVisibilityState(vh, position);

        // Handle animation and update data
        ObjectAnimator animation = ObjectAnimator.ofInt(vh.details, "maxLines",
                vh.details.getMaxLines());
        animation.setDuration(200).start();
        notifyDataSetChanged();
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

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final BackgroundCardViewHolder vh, int pos) {
        final int position = vh.getAdapterPosition();
        vh.name.setText(this.backgrounds[position]);
        vh.description.setText(this.getCharacterBackgroundDescription(vh.context, position));
        vh.details.setText(this.fromHtml(this.getCharacterBackgroundDetails(vh.context, position)));

        // Set character background
        try {
            String characterBackground = this.backgrounds[position].toLowerCase();
            int drawableId = R.drawable.class.getField("background_" + characterBackground).getInt(null);
            vh.background_icon.setImageResource(drawableId);
            vh.background_icon.setVisibility(View.VISIBLE);
        } catch (Exception e) {
            vh.background_icon.setVisibility(View.INVISIBLE);
        }

        // Set tags for current card
        vh.expand_icon.setTag(R.id.background_card_position, position);
        vh.select_btn.setTag(R.id.background_card_position, position);

        // Set up current expansion state
        updateVisibilityState(vh, position);

        /**
         * Listen to action button clicks in card view
         */

        // Update UI and not actual change in state
        vh.expand_icon.setOnClickListener(null);

        // Set up expand icon
        vh.expand_icon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                toggleVisibilityState(vh, position);
            }
        });

        // Set up select button
        vh.select_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                TextView tv = (TextView) view;
                Context context = view.getContext();
                Activity calling_activity = (Activity) context;

                // Get background card position from card
                int pos = (Integer) view.getTag(R.id.background_card_position);

                current.character.background = backgrounds[pos];

                // Save campaign and proceed to next activity
                if (!firstTime) {
                    db.updateCampaign(current);
                    calling_activity.finish();
                    Snackbar.make(view.findViewById(R.id.background_list),
                            context.getResources().getString(R.string.finish_select_background),
                            Snackbar.LENGTH_LONG).show();
                } else {
                    current.status = 4;
                    db.updateCampaign(current);
                    Intent next = new Intent(context, MainActivity.class);
                    next.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    context.startActivity(next);
                    calling_activity.finish();
                }
            }
        });
    }

    // Override recycler view method
    @Override
    public void onAttachedToRecyclerView(RecyclerView recyclerView) {
        super.onAttachedToRecyclerView(recyclerView);
    }

    // Return the number of backgrounds (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return this.backgrounds.length;
    }
}