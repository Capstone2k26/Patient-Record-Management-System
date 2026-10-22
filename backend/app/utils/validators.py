def validate_required_fields(data, required_fields):
    if not data:
        return False, 'Request body is required'
    
    missing = [field for field in required_fields if field not in data or not data[field]]
    
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"
    
    return True, None

def validate_email(email):
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    import re
    pattern = r'^\+?1?\d{9,15}$'
    return re.match(pattern, phone.replace('-', '').replace(' ', '')) is not None
