package com.athletix.entity;

public enum ScheduleType {
    NORMAL,          // Regular operating hours
    EXTENDED,        // Extended hours (e.g., weekend special)
    REDUCED,         // Reduced hours
    CLOSED,          // Completely closed
    MAINTENANCE,     // Closed for maintenance
    SPECIAL_EVENT    // Reserved for special event
}