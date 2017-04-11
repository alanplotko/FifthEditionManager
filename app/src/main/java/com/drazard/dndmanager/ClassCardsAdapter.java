package com.drazard.dndmanager;

import android.animation.ObjectAnimator;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
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

public class ClassCardsAdapter extends RecyclerView.Adapter<ClassCardsAdapter.ClassCardViewHolder> {
    private String[] classes;
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

    public static class ClassCardViewHolder extends RecyclerView.ViewHolder {
        private CardView card;

        /**
         * Card details
         */
        private final Context context;
        private TextView name;
        private TextView description;
        private ImageView class_icon;
        private TextView details;
        private ImageView expand_icon;
        private Button select_btn;

        public ClassCardViewHolder(View view) {
            super(view);
            context = view.getContext();
            card = (CardView) view.findViewById(R.id.class_card);
            name = (TextView) view.findViewById(R.id.class_name);
            description = (TextView) view.findViewById(R.id.class_description);
            class_icon = (ImageView) view.findViewById(R.id.class_icon);
            details = (TextView) view.findViewById(R.id.class_details);
            expand_icon = (ImageView) view.findViewById(R.id.class_details_expand_icon);
            select_btn = (Button) view.findViewById(R.id.btn_select_class);
        }
    }

    // Pass list of campaigns to adapter
    public ClassCardsAdapter(View v, Campaign campaign, DBHandler db, boolean firstTime) {
        this.classes = v.getResources().getStringArray(R.array.character_class_options);
        if (this.expandList == null) {
            this.expandList = new boolean[this.classes.length];
        }
        this.campaignId = campaign._id;
        this.firstTime = firstTime;
        this.current = campaign;
        this.db = db;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public ClassCardViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View v = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.item_class_card, viewGroup, false);
        ClassCardViewHolder vh = new ClassCardViewHolder(v);
        return vh;
    }

    public String getCharacterClassDescription(Context c, int pos) {
        int stringId;
        // Attempt to fetch description for given character class
        try {
            String fieldName = "class_" + this.classes[pos].toLowerCase();
            stringId = R.string.class.getField(fieldName).getInt(null);
        } catch (Exception e) {
            stringId = R.string.no_character_class_description;
        }
        return c.getResources().getString(stringId);
    }

    public String getCharacterClassDetails(Context c, int pos) {
        int stringId;
        // Attempt to fetch additional details for given character class
        try {
            String fieldName = "class_" + this.classes[pos].toLowerCase() + "_details";
            stringId = R.string.class.getField(fieldName).getInt(null);
        } catch (Exception e) {
            stringId = R.string.no_character_class_details;
        }
        return c.getResources().getString(stringId);
    }

    public void updateVisibilityState(ClassCardViewHolder vh, int position) {
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

    public void toggleVisibilityState(ClassCardViewHolder vh, int position) {
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

    public void proceedToBackgroundSelection(Context context) {
        Intent next = new Intent(context, CharacterBackgroundSelectionActivity.class);
        next.putExtra("campaignId", campaignId);
        next.putExtra("firstTime", true);
        context.startActivity(next);
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ClassCardViewHolder vh, int pos) {
        final int position = vh.getAdapterPosition();
        vh.name.setText(this.classes[position]);
        vh.description.setText(this.getCharacterClassDescription(vh.context, position));
        vh.details.setText(this.fromHtml(this.getCharacterClassDetails(vh.context, position)));

        // Set character class
        try {
            String characterClass = this.classes[position].toLowerCase();
            int drawableId = R.drawable.class.getField("class_" + characterClass).getInt(null);
            vh.class_icon.setImageResource(drawableId);
            vh.class_icon.setVisibility(View.VISIBLE);
        } catch (Exception e) {
            vh.class_icon.setVisibility(View.INVISIBLE);
        }

        // Set tags for current card
        vh.expand_icon.setTag(R.id.class_card_position, position);
        vh.select_btn.setTag(R.id.class_card_position, position);

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

                // Get class card position from card
                int pos = (Integer) view.getTag(R.id.class_card_position);

                current.character.class_ = classes[pos];

                // Save campaign and proceed to next activity
                if (!firstTime) {
                    db.updateCampaign(current);
                    calling_activity.setResult(CharacterClassSelectionActivity.EDIT_SUCCESS);
                    calling_activity.finish();
                } else {
                    current.status = 3;
                    db.updateCampaign(current);
                    proceedToBackgroundSelection(context);
                }
            }
        });
    }

    // Override recycler view method
    @Override
    public void onAttachedToRecyclerView(RecyclerView recyclerView) {
        super.onAttachedToRecyclerView(recyclerView);
    }

    // Return the number of classes (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return this.classes.length;
    }
}