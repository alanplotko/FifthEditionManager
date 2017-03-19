package com.drazard.dndmanager;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;

public class CampaignsAdapter extends RecyclerView.Adapter<CampaignsAdapter.CampaignViewHolder> {
    private List<Campaign> campaigns;
    private Context mainActivityContext;

    public static class CampaignViewHolder extends RecyclerView.ViewHolder {
        private CardView card;

        /**
         * Card details
         */
        private final Context context;
        private TextView name;
        private TextView description;
        private TextView lastUpdated;
        private ImageView portrait;
        private ImageView classIcon;
        private Button editBtn;
        private Button delBtn;

        public CampaignViewHolder(View view) {
            super(view);
            context = view.getContext();
            card = (CardView) itemView.findViewById(R.id.campaign_card);
            name = (TextView) itemView.findViewById(R.id.campaign_name);
            lastUpdated = (TextView) itemView.findViewById(R.id.campaign_timestamp);
            description = (TextView) itemView.findViewById(R.id.campaign_description);
            portrait = (ImageView) itemView.findViewById(R.id.character_portrait);
            classIcon = (ImageView) itemView.findViewById(R.id.character_class);
            editBtn = (Button) itemView.findViewById(R.id.btn_edit_campaign);
            delBtn = (Button) itemView.findViewById(R.id.btn_delete_campaign);
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
    public CampaignsAdapter(List<Campaign> campaigns, Context activity) {
        this.campaigns = campaigns;
        this.mainActivityContext = activity;
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
    public void onBindViewHolder(final CampaignViewHolder campaignViewHolder, final int pos) {
        Campaign current = this.campaigns.get(pos);
        String fullName = current.character.firstName + " " + current.character.lastName;
        campaignViewHolder.name.setText(fullName);
        campaignViewHolder.lastUpdated.setText(current.getRelativeTime());

        // Make background slightly transparent for campaign timestamp
        campaignViewHolder.lastUpdated.getBackground().setAlpha(120);

        campaignViewHolder.description.setText(current.character.toString());

        // Set text of edit button based on whether user completed new campaign process entirely
        if (current.status == 4) {
            campaignViewHolder.editBtn.setText(R.string.edit_campaign);
        } else {
            campaignViewHolder.editBtn.setText(R.string.resume_create_campaign);
        }

        // Set character portrait
        try {
            String characterRace = this.campaigns.get(pos).character.race.toLowerCase()
                    .replace("-", "_");
            int drawableId = R.drawable.class.getField("portrait_" + characterRace).getInt(null);
            campaignViewHolder.portrait.setImageResource(drawableId);
            campaignViewHolder.portrait.setBackgroundColor(0);
            campaignViewHolder.portrait.setScaleType(ImageView.ScaleType.CENTER_CROP);
            campaignViewHolder.portrait.setAdjustViewBounds(false);
        } catch (Exception e) {
            campaignViewHolder.portrait.setImageResource(R.drawable.ic_character_portrait_unknown);
            campaignViewHolder.portrait.setBackgroundResource(R.color.colorPrimary);
            campaignViewHolder.portrait.setScaleType(ImageView.ScaleType.FIT_XY);
            campaignViewHolder.portrait.setAdjustViewBounds(true);
        }
        campaignViewHolder.portrait.setVisibility(View.VISIBLE);

        // Set character class
        try {
            String characterClass = this.campaigns.get(pos).character.class_.toLowerCase();
            int drawableId = R.drawable.class.getField("class_" + characterClass).getInt(null);
            campaignViewHolder.classIcon.setImageResource(drawableId);
            campaignViewHolder.classIcon.setVisibility(View.VISIBLE);
        } catch (Exception e) {
            campaignViewHolder.classIcon.setVisibility(View.INVISIBLE);
        }

        // Set tags for current card
        campaignViewHolder.editBtn.setTag(R.id.campaign_id, current._id);
        campaignViewHolder.editBtn.setTag(R.id.campaign_progress, current.status);
        campaignViewHolder.delBtn.setTag(R.id.campaign_id, current._id);
        campaignViewHolder.delBtn.setTag(R.id.campaign_character_name, fullName);
        campaignViewHolder.delBtn.setTag(R.id.campaign_position, pos);

        /**
         * Listen to action button clicks in card view
         */

        // Set up edit/resume button
        campaignViewHolder.editBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Context context = view.getContext();
                TextView tv = (TextView) view;

                // Get campaign id and progress from card
                long campaignId = (Long) view.getTag(R.id.campaign_id);
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
                        break;
                    // User has not yet selected a character class
                    case 2:
                        next = new Intent(context, CharacterClassSelectionActivity.class);
                        break;
                    // User has not yet selected a character background
                    case 3:
                        next = new Intent(context, CharacterBackgroundSelectionActivity.class);
                        break;
                    // User has not yet worked on stats or what not (next step)
                    case 4:
                        break;
                }
                if (next != null) {
                    next.putExtra("firstTime", (progress != 4));
                    next.putExtra("campaignId", campaignId);
                    context.startActivity(next);
                }
            }
        });

        // Set up delete button
        campaignViewHolder.delBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                final Context context = view.getContext();
                TextView tv = (TextView) view;

                // Get campaign id and character name from card
                final long campaignId = (Long) view.getTag(R.id.campaign_id);
                final String characterName = (String) view.getTag(R.id.campaign_character_name);
                final int position = (Integer) view.getTag(R.id.campaign_position);

                // Set up alert dialog layout
                View dialog_view = LayoutInflater.from(context).inflate(R.layout.delete_dialog,
                        null);
                final EditText input = (EditText) dialog_view.findViewById(R.id.character_name);

                // Set up alert dialog window
                final AlertDialog alert = new AlertDialog.Builder(context)
                        .setView(dialog_view)
                        .setTitle(R.string.alert_del_campaign_title)
                        .setMessage(R.string.alert_del_campaign_message)
                        .setPositiveButton(android.R.string.ok, null)
                        .setNegativeButton(android.R.string.cancel, null)
                        .create();

                alert.setOnShowListener(new DialogInterface.OnShowListener() {
                    @Override
                    public void onShow(DialogInterface dialog) {

                        Button positive = alert.getButton(AlertDialog.BUTTON_POSITIVE);
                        positive.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View view) {
                                String inputText = input.getText().toString();
                                if (inputText.equals(characterName)) {
                                    DBHandler db = DBHandler.getInstance(context);
                                    db.deleteCampaign(campaignId);
                                    campaigns.remove(position);
                                    notifyDataSetChanged();
                                    if (mainActivityContext instanceof MainActivity) {
                                        ((MainActivity)mainActivityContext)
                                                .updatePlaceholder(isEmpty());
                                    }
                                    alert.dismiss();
                                } else {
                                    input.setError(context.getResources()
                                            .getString(R.string.error_mismatch_character_name));
                                }
                            }
                        });

                        Button negative = alert.getButton(AlertDialog.BUTTON_NEGATIVE);
                        negative.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View view) {
                                alert.dismiss();
                            }
                        });
                    }
                });

                alert.show();
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
