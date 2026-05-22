from datetime import datetime

def predict_crowd():
    hour = datetime.now().hour

    if 8 <= hour <= 11:
        return "High"
    elif 17 <= hour <= 20:
        return "High"
    elif 12 <= hour <= 16:
        return "Medium"
    else:
        return "Low"