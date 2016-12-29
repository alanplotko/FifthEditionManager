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
    private List<Campaign> _campaigns;

    public static class CampaignViewHolder extends RecyclerView.ViewHolder {
        CardView _card;

        /**
         * Card details
         */
        TextView name;
        TextView description;
        TextView last_updated;
        ImageView class_thumbnail;

        public CampaignViewHolder(View view) {
            super(view);
            _card = (CardView) itemView.findViewById(R.id.campaign_card);
            name = (TextView) itemView.findViewById(R.id.campaign_name);
            last_updated = (TextView) itemView.findViewById(R.id.campaign_timestamp);
            class_thumbnail = (ImageView) itemView.findViewById(R.id.campaign_thumbnail);
        }
    }

    // Check if campaign list is populated
    public Boolean isEmpty() {
        return this.getItemCount() == 0;
    }

    // Update campaigns in adapter
    public void swapItems(List<Campaign> campaigns) {
        this._campaigns = campaigns;
        notifyDataSetChanged();
    }

    // Pass list of campaigns to adapter
    public CampaignsAdapter(List<Campaign> campaigns) {
        this._campaigns = campaigns;
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
        campaignViewHolder.name.setText(this._campaigns.get(pos).getCharacter().getFullName());
        campaignViewHolder.last_updated.setText(this._campaigns.get(pos).getRelativeTime());
        try {
            String characterClass = this._campaigns.get(pos).getCharacter().getCharacterClass();
            int drawableId = R.drawable.class.getField("class_" + characterClass).getInt(null);
            campaignViewHolder.class_thumbnail.setImageResource(drawableId);
        } catch (Exception e) {
            campaignViewHolder.class_thumbnail.setImageResource(R.drawable.class_unknown);
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
        return this._campaigns.size();
    }
}
