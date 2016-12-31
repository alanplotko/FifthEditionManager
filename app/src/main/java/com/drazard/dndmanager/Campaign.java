package com.drazard.dndmanager;

import android.database.Cursor;
import android.text.format.DateUtils;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Campaign {
    int _id;
    long created_at, updated_at;
    String player_name;
    Character character;

    /**
     * Default constructor
     */
    public Campaign() {}

    /**
     * Reconstruct campaign from DB
     */
    public Campaign(Cursor cursor) {
        this._id = Integer.parseInt(cursor.getString(0));
        this.created_at = Timestamp.valueOf(cursor.getString(1)).getTime();
        this.updated_at = Timestamp.valueOf(cursor.getString(2)).getTime();
        this.player_name = cursor.getString(3);
        this.character = new Character();
        this.character.setFirstName(cursor.getString(4));
        this.character.setLastName(cursor.getString(5));
        this.character.setCharacterRace(cursor.getString(6));
        this.character.setCharacterClass(cursor.getString(7));
        this.character.setCharacterLevel(Integer.parseInt(cursor.getString(8)));
        this.character.setGender(cursor.getString(9));
        this.character.setAlignment(cursor.getString(10));
        this.character.setHeight(cursor.getString(11));
        this.character.setWeight(cursor.getString(12));
        this.character.setAge(cursor.getString(13));
        this.character.setExp(Integer.parseInt(cursor.getString(14)));
    }

    /**
     * Getter & setters
     */

    public int getID() {
        return this._id;
    }
    public void setID(int id) {
        this._id = id;
    }

    public String getPlayerName() {
        return player_name;
    }
    public void setPlayerName(String playerNameIn) {
        this.player_name = playerNameIn;
    }

    // Getter & setter for creation and update times
    public long getRawStartDate() {
        return this.created_at;
    }
    public void setRawStartDate(long t) {
        this.created_at = t;
    }
    public long getRawUpdateTime() {
        return this.updated_at;
    }
    public void setRawUpdateTime(long t) {
        this.updated_at = t;
    }
    public String getStartDate() {
        Date date = new Date(this.created_at);
        SimpleDateFormat formatter = new SimpleDateFormat("M. D, yy");
        return "Started on " + formatter.format(date);
    }
    public String getRelativeTime() {
        long now = System.currentTimeMillis();
        return "Last updated " + DateUtils.getRelativeTimeSpanString(this.updated_at, now,
                DateUtils.SECOND_IN_MILLIS).toString().toLowerCase();
    }

    public Character getCharacter() {
        return this.character;
    }
    public void setCharacter(Character character) {
        this.character = character;
    }
}
