package com.drazard.dndmanager;

import android.app.Activity;
import android.content.Context;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

public class ClassCardsAdapter extends RecyclerView.Adapter<ClassCardsAdapter.ClassCardViewHolder> {
    private String[] classes;
    private int campaign_id;
    private boolean first_time;
    private Campaign current;
    private DBHandler db;

    public static class ClassCardViewHolder extends RecyclerView.ViewHolder {
        private CardView card;

        /**
         * Card details
         */
        private final Context context;
        private TextView name;
        private TextView description;
        private ImageView class_icon;
        private Button select_btn;

        public ClassCardViewHolder(View view) {
            super(view);
            context = view.getContext();
            card = (CardView) itemView.findViewById(R.id.class_card);
            name = (TextView) itemView.findViewById(R.id.class_name);
            description = (TextView) itemView.findViewById(R.id.class_description);
            class_icon = (ImageView) itemView.findViewById(R.id.class_icon);
            select_btn = (Button) itemView.findViewById(R.id.btn_select_class);
        }
    }

    // Pass list of campaigns to adapter
    public ClassCardsAdapter(View v, int campaignId, boolean firstTime) {
        this.classes = v.getResources().getStringArray(R.array.character_class_options);
        this.campaign_id = campaignId;
        this.first_time = firstTime;
        this.db = DBHandler.getInstance(v.getContext());
        this.current = db.getCampaign(this.campaign_id);
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
        // Attempt to fetch description for given character race
        try {
            String fieldName = "class_" + this.classes[pos].toLowerCase();
            stringId = R.string.class.getField(fieldName).getInt(null);
        } catch (Exception e) {
            stringId = R.string.no_character_class_description;
        }
        return c.getResources().getString(stringId);
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ClassCardViewHolder vh, int pos) {
        vh.name.setText(this.classes[pos]);
        vh.description.setText(this.getCharacterClassDescription(vh.context, pos));

        // Set character class
        try {
            String characterClass = this.classes[pos].toLowerCase();
            int drawableId = R.drawable.class.getField("class_" + characterClass).getInt(null);
            vh.class_icon.setImageResource(drawableId);
            vh.class_icon.setVisibility(View.VISIBLE);
        } catch (Exception e) {
            vh.class_icon.setVisibility(View.INVISIBLE);
        }

        // Set tags for current card
        vh.select_btn.setTag(R.id.class_card_position, pos);

        /**
         * Listen to action button clicks in card view
         */

        // Set up select button
        vh.select_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                TextView tv = (TextView) view;
                Context context = view.getContext();
                Activity calling_activity = (Activity) context;

                // Get class card position from card
                int pos = (Integer) view.getTag(R.id.class_card_position);

                Character character = current.getCharacter();
                character.setCharacterClass(classes[pos]);
                current.setCharacter(character);

                // Save campaign and proceed to next activity
                if (!first_time) {
                    db.updateCampaign(current);
                    calling_activity.finish();
                    /*Snackbar.make(findViewById(R.id.class_list),
                            getResources().getString(R.string.finish_select_class),
                            Snackbar.LENGTH_LONG).show();*/
                } else {
                    current.setStatus(3);
                    db.updateCampaign(current);
                    /*Intent next = new Intent(this, .class);
                    next.putExtra("campaign_id", campaign_id);
                    next.putExtra("first_time", true);
                    calling_activity.finish();
                    startActivity(next);*/
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
