package com.drazard.dndmanager;

import android.content.Context;
import android.content.Intent;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;

public class CampaignsAdapter extends RecyclerView.Adapter<CampaignsAdapter.CampaignViewHolder> {
    private List<Campaign> campaigns;

    public static class CampaignViewHolder extends RecyclerView.ViewHolder {
        CardView card;

        /**
         * Card details
         */
        private final Context context;
        private TextView name;
        private TextView description;
        private TextView last_updated;
        private ImageView portrait;
        private ImageView class_icon;
        private Button edit_btn;

        public CampaignViewHolder(View view) {
            super(view);
            context = view.getContext();
            card = (CardView) itemView.findViewById(R.id.campaign_card);
            name = (TextView) itemView.findViewById(R.id.campaign_name);
            last_updated = (TextView) itemView.findViewById(R.id.campaign_timestamp);
            description = (TextView) itemView.findViewById(R.id.campaign_description);
            portrait = (ImageView) itemView.findViewById(R.id.character_portrait);
            class_icon = (ImageView) itemView.findViewById(R.id.character_class);
            edit_btn = (Button) itemView.findViewById(R.id.btn_edit_campaign);
        }
    }

    // Check if campaign list is populated
    public Boolean isEmpty() {
        return this.getItemCount() == 0;
    }

    // Update campaigns in adapter
    public void swapItems(List<Campaign> campaigns) {
        this.campaigns = campaigns;
        notifyDataSetChanged();
    }

    // Pass list of campaigns to adapter
    public CampaignsAdapter(List<Campaign> campaigns) {
        this.campaigns = campaigns;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public CampaignViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View v = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.item_campaign, viewGroup, false);
        CampaignViewHolder cvh = new CampaignViewHolder(v);
        return cvh;
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final CampaignViewHolder campaignViewHolder, int pos) {
        Campaign current = this.campaigns.get(pos);
        campaignViewHolder.name.setText(current.getCharacter().getFullName());
        campaignViewHolder.last_updated.setText(current.getRelativeTime());

        // Make background slightly transparent for campaign timestamp
        campaignViewHolder.last_updated.getBackground().setAlpha(120);

        campaignViewHolder.description.setText(current.getCharacter().toString());

        // Set text of edit button based on whether user completed new campaign process entirely
        if (current.getStatus() == -1) {
            campaignViewHolder.edit_btn.setText(R.string.edit_campaign);
        } else {
            campaignViewHolder.edit_btn.setText(R.string.resume_create_campaign);
        }

        // Set character portrait
        try {
            String characterRace = this.campaigns.get(pos).getCharacter()
                    .getCharacterRace().toLowerCase().replace("-", "_");
            int drawableId = R.drawable.class.getField("portrait_" + characterRace).getInt(null);
            campaignViewHolder.portrait.setImageResource(drawableId);
            campaignViewHolder.portrait.setVisibility(View.VISIBLE);
        } catch (Exception e) {
            campaignViewHolder.portrait.setVisibility(View.INVISIBLE);
        }

        // Set character class
        try {
            String characterClass = this.campaigns.get(pos).getCharacter()
                    .getCharacterClass().toLowerCase();
            int drawableId = R.drawable.class.getField("class_" + characterClass).getInt(null);
            campaignViewHolder.class_icon.setImageResource(drawableId);
            campaignViewHolder.class_icon.setVisibility(View.VISIBLE);
        } catch (Exception e) {
            campaignViewHolder.class_icon.setVisibility(View.INVISIBLE);
        }

        // Set tags for current card
        campaignViewHolder.edit_btn.setTag(R.id.campaign_id, current.getID());
        campaignViewHolder.edit_btn.setTag(R.id.campaign_progress, current.getStatus());

        /**
         * Listen to action button clicks in card view
         */

        // Set up edit/resume button
        campaignViewHolder.edit_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Context context = view.getContext();
                TextView tv = (TextView) view;

                // Get campaign id and progress from card
                int campaign_id = (Integer) view.getTag(R.id.campaign_id);
                int progress = (Integer) view.getTag(R.id.campaign_progress);

                // Determine intent for campaign by user's progress in campaign creation process
                Intent next = null;

                switch (progress) {
                    // User has completed the process and would like to make modifications
                    case -1:
                        next = new Intent(context, NewCampaignActivity.class);
                        break;
                    // User has not yet selected a character race
                    case 1:
                        next = new Intent(context, CharacterRaceSelectionActivity.class);
                        // TODO: Account for any character build -breaking changes and warn user
                        break;
                    // User has not yet selected a character class
                    case 2:
                        next = new Intent(context, CharacterClassSelectionActivity.class);
                        // TODO: Account for any character build -breaking changes and warn user
                        break;
                    // User has not yet worked on stats or what not (next step)
                    case 3:
                        // TODO: Account for any character build -breaking changes and warn user
                        break;
                }
                if (next != null) {
                    next.putExtra("first_time", (progress != -1));
                    next.putExtra("campaign_id", campaign_id);
                    context.startActivity(next);
                }
            }
        });
    }

    // Override recycler view method
    @Override
    public void onAttachedToRecyclerView(RecyclerView recyclerView) {
        super.onAttachedToRecyclerView(recyclerView);
    }

    // Return the number of campaigns (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return this.campaigns.size();
    }
}
