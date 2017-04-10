package com.drazard.dndmanager;

import android.database.Cursor;
import android.text.format.DateUtils;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Campaign {
    long _id;
    int status; // Current progress in the campaign creation process, -1 = done
    long createdAt, updatedAt;
    String playerName;
    Character character;

    /**
     * Default constructor
     */
    public Campaign() {}

    /**
     * Reconstruct campaign from DB
     */
    public Campaign(Cursor cursor) {
        this._id = Long.parseLong(cursor.getString(0));
        this.status = Integer.parseInt(cursor.getString(1));
        this.createdAt = Timestamp.valueOf(cursor.getString(2)).getTime();
        this.updatedAt = Timestamp.valueOf(cursor.getString(3)).getTime();
        this.playerName = cursor.getString(4);
        this.character = new Character();
        this.character.firstName = cursor.getString(5);
        this.character.lastName = cursor.getString(6);
        this.character.race = cursor.getString(7);
        this.character.class_ = cursor.getString(8);
        this.character.level = Integer.parseInt(cursor.getString(9));
        this.character.gender = cursor.getString(10);
        this.character.alignment = cursor.getString(11);
        this.character.height = cursor.getString(12);
        this.character.weight = cursor.getString(13);
        this.character.age = cursor.getString(14);
        this.character.exp = Integer.parseInt(cursor.getString(15));
    }

    /**
     * Date and time formatters
     */

    public String getStartDate() {
        Date date = new Date(this.createdAt);
        SimpleDateFormat formatter = new SimpleDateFormat("M. D, yy");
        return "Started on " + formatter.format(date);
    }
    public String getRelativeTime() {
        long now = System.currentTimeMillis();
        return "Last updated " + DateUtils.getRelativeTimeSpanString(this.updatedAt, now,
                DateUtils.SECOND_IN_MILLIS).toString();
    }
}
