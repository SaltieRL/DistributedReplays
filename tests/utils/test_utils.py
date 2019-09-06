def function_result_creator():
    stored_result = ""

    def set_result(result):
        nonlocal stored_result
        stored_result = result

    def get_result():
        return stored_result

    return set_result, get_result
