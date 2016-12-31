package com.drazard.dndmanager;

import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
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
        TextView name;
        TextView description;
        TextView last_updated;
        ImageView portrait;
        ImageView class_icon;

        public CampaignViewHolder(View view) {
            super(view);
            card = (CardView) itemView.findViewById(R.id.campaign_card);
            name = (TextView) itemView.findViewById(R.id.campaign_name);
            last_updated = (TextView) itemView.findViewById(R.id.campaign_timestamp);
            description = (TextView) itemView.findViewById(R.id.campaign_description);
            portrait = (ImageView) itemView.findViewById(R.id.character_portrait);
            class_icon = (ImageView) itemView.findViewById(R.id.character_class);
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
    public void onBindViewHolder(CampaignViewHolder campaignViewHolder, int pos) {
        campaignViewHolder.name.setText(this.campaigns.get(pos).getCharacter().getFullName());
        campaignViewHolder.last_updated.setText(this.campaigns.get(pos).getRelativeTime());

        // Make background slightly transparent for campaign timestamp
        campaignViewHolder.last_updated.getBackground().setAlpha(120);

        campaignViewHolder.description.setText(this.campaigns.get(pos).getCharacter().toString());

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
