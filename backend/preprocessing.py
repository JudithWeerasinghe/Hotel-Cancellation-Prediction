import pandas as pd
import numpy as np

from pathlib import Path


# Find the project root folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Load the training data only to get the expected 63 columns
X_train = pd.read_csv(BASE_DIR / "X_train.csv")

expected_columns = X_train.columns.tolist()


def preprocess_booking_input(booking_dict):
    """
    Convert raw booking details into the exact format
    expected by the trained XGBoost model.
    """

    df_input = pd.DataFrame([booking_dict])

    # Feature engineering
    df_input["total_nights"] = (
        df_input["stays_in_weekend_nights"]
        + df_input["stays_in_week_nights"]
    )

    df_input["total_guests"] = (
        df_input["adults"]
        + df_input["children"]
        + df_input["babies"]
    )

    df_input["is_family"] = np.where(
        (df_input["children"] > 0) | (df_input["babies"] > 0),
        1,
        0
    )

    # Create arrival season
    def get_season(month):
        if month in ["December", "January", "February"]:
            return "Winter"
        elif month in ["March", "April", "May"]:
            return "Spring"
        elif month in ["June", "July", "August"]:
            return "Summer"
        else:
            return "Autumn"

    df_input["arrival_season"] = (
        df_input["arrival_date_month"].apply(get_season)
    )

    # One-hot encoding
    low_cardinality_cols = [
        "hotel",
        "meal",
        "market_segment",
        "distribution_channel",
        "reserved_room_type",
        "assigned_room_type",
        "deposit_type",
        "customer_type",
        "arrival_season"
    ]

    df_encoded = pd.get_dummies(
        df_input,
        columns=low_cardinality_cols
    )

    # Make sure we have exactly the same 63 columns
    df_final = df_encoded.reindex(
        columns=expected_columns,
        fill_value=0
    )

    return df_final

def validate_booking_input(booking_dict):
    errors = []

    required_fields = [
        "hotel",
        "lead_time",
        "arrival_date_year",
        "arrival_date_month",
        "arrival_date_week_number",
        "arrival_date_day_of_month",
        "stays_in_weekend_nights",
        "stays_in_week_nights",
        "adults",
        "children",
        "babies",
        "meal",
        "country_encoded",
        "market_segment",
        "distribution_channel",
        "is_repeated_guest",
        "previous_cancellations",
        "previous_bookings_not_canceled",
        "reserved_room_type",
        "assigned_room_type",
        "booking_changes",
        "deposit_type",
        "days_in_waiting_list",
        "customer_type",
        "adr",
        "required_car_parking_spaces",
        "total_of_special_requests"
    ]

    # Check required fields
    for field in required_fields:
        if field not in booking_dict or booking_dict[field] is None:
            errors.append(f"Missing required field: {field}")

    numeric_fields = [
        "lead_time",
        "arrival_date_year",
        "arrival_date_week_number",
        "arrival_date_day_of_month",
        "stays_in_weekend_nights",
        "stays_in_week_nights",
        "adults",
        "children",
        "babies",
        "country_encoded",
        "is_repeated_guest",
        "previous_cancellations",
        "previous_bookings_not_canceled",
        "booking_changes",
        "days_in_waiting_list",
        "adr",
        "required_car_parking_spaces",
        "total_of_special_requests"
    ]

    # Check data types
    for field in numeric_fields:
        if field in booking_dict and booking_dict[field] is not None:
            if not isinstance(booking_dict[field], (int, float)) or isinstance(
                booking_dict[field], bool
            ):
                errors.append(
                    f"{field} must be a number, "
                    f"got '{type(booking_dict[field]).__name__}'"
                )

    # Negative value checks
    non_negative_fields = [
        "lead_time",
        "stays_in_weekend_nights",
        "stays_in_week_nights",
        "adults",
        "children",
        "babies",
        "country_encoded",
        "previous_cancellations",
        "previous_bookings_not_canceled",
        "booking_changes",
        "days_in_waiting_list",
        "adr",
        "required_car_parking_spaces",
        "total_of_special_requests"
    ]

    for field in non_negative_fields:
        if (
            field in booking_dict
            and isinstance(booking_dict[field], (int, float))
            and booking_dict[field] < 0
        ):
            errors.append(f"{field} cannot be negative")

    # Unrealistic value checks
    if (
        isinstance(booking_dict.get("adults"), (int, float))
        and booking_dict["adults"] > 10
    ):
        errors.append("adults value seems unrealistic (>10)")

    if (
        isinstance(booking_dict.get("lead_time"), (int, float))
        and booking_dict["lead_time"] > 500
    ):
        errors.append("lead_time value seems unrealistic (>500 days)")

    if (
        isinstance(booking_dict.get("adr"), (int, float))
        and booking_dict["adr"] > 5000
    ):
        errors.append("adr (price) value seems unrealistic (>5000)")

    return errors