package com.drazard.dndmanager;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class DBHandler extends SQLiteOpenHelper {
    /**
     * Static variables
     */
    private static DBHandler sInstance;


    // Database version
    private static final int DATABASE_VERSION = 1;

    // Database name
    private static final String DATABASE_NAME = "campaignsManager";

    // Campaigns table name
    private static final String TABLE_CAMPAIGNS = "campaigns";

    // Campaigns table column names
    private static final String KEY_ID = "id";
    private static final String KEY_CREATED_AT = "created_at";
    private static final String KEY_UPDATED_AT = "updated_at";
    private static final String KEY_FNAME = "first_name";
    private static final String KEY_LNAME = "last_name";
    private static final String KEY_CLASS = "class";

    public static synchronized DBHandler getInstance(Context context) {
        // Use  application context to avoid leaking an Activity's context.
        // More info in article: http://bit.ly/6LRzfx
        if (sInstance == null) {
            sInstance = new DBHandler(context.getApplicationContext());
        }
        return sInstance;
    }

    private DBHandler(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    // Create tables
    @Override
    public void onCreate(SQLiteDatabase db) {
        String createTableCommand = "CREATE TABLE "
                + TABLE_CAMPAIGNS + "("
                + KEY_ID          + " INTEGER PRIMARY KEY AUTOINCREMENT, "
                + KEY_CREATED_AT  + " TIMESTAMP, "
                + KEY_UPDATED_AT  + " TIMESTAMP, "
                + KEY_FNAME       + " TEXT, "
                + KEY_LNAME       + " TEXT, "
                + KEY_CLASS       + " TEXT " + ")";
        db.execSQL(createTableCommand);
    }

    // Upgrade database
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // Drop older table if existed
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_CAMPAIGNS);

        // Recreate table
        onCreate(db);
    }

    /**
     * CRUD operations
     */

    // Add new campaign
    public void addCampaign(Campaign campaign) {
        SQLiteDatabase db = this.getWritableDatabase();

        // Set up row
        ContentValues values = new ContentValues();
        Timestamp created_at = new Timestamp(campaign.getRawStartDate());
        Timestamp updated_at = new Timestamp(campaign.getRawUpdateDate());
        values.put(KEY_CREATED_AT, created_at.toString());
        values.put(KEY_UPDATED_AT, updated_at.toString());

        Character character = campaign.getCharacter();
        values.put(KEY_FNAME, character.getFirstName());
        values.put(KEY_LNAME, character.getLastName());
        values.put(KEY_CLASS, character.getCharacterClass());

        // Insert row
        db.insert(TABLE_CAMPAIGNS, null, values);

        // Close db connection
        db.close();
    }

    // Get single campaign
    public Campaign getCampaign(int id) {
        SQLiteDatabase db = this.getReadableDatabase();

        Cursor cursor = db.query(TABLE_CAMPAIGNS, new String[] {
                KEY_ID, KEY_CREATED_AT, KEY_UPDATED_AT, KEY_FNAME, KEY_LNAME, KEY_CLASS
        }, KEY_ID + "=?", new String[] { String.valueOf(id) }, null, null, null, null);

        if (cursor != null) cursor.moveToFirst();
        Campaign campaign = new Campaign(cursor);
        return campaign;
    }

    // Get All Campaigns
    public List<Campaign> getAllCampaigns() {
        List<Campaign> campaignList = new ArrayList<Campaign>();
        String selectQuery = "SELECT  * FROM " + TABLE_CAMPAIGNS
                + " ORDER BY " + KEY_UPDATED_AT + " DESC";
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery(selectQuery, null);

        // Add all campaigns to list
        if (cursor.moveToFirst()) {
            do {
                Campaign campaign = new Campaign(cursor);
                campaignList.add(campaign);
            } while (cursor.moveToNext());
        }

        // Return campaign list
        return campaignList;
    }

    // Get number of saved campaigns
    public int getCampaignCount() {
        String countQuery = "SELECT  * FROM " + TABLE_CAMPAIGNS;
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(countQuery, null);
        cursor.close();
        return cursor.getCount();
    }

    // Update single campaign
    public int updateCampaign(Campaign campaign) {
        SQLiteDatabase db = this.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put(KEY_UPDATED_AT, campaign.getRawUpdateDate());

        // updating row
        return db.update(TABLE_CAMPAIGNS, values, KEY_ID + " = ?",
                new String[] { String.valueOf(campaign.getID()) });
    }

    // Delete single campaign
    public void deleteCampaign(Campaign campaign) {
        SQLiteDatabase db = this.getWritableDatabase();
        db.delete(TABLE_CAMPAIGNS, KEY_ID + " = ?",
                new String[] { String.valueOf(campaign.getID()) });
        db.close();
    }
}
