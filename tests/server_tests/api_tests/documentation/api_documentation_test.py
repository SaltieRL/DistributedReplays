
from requests import Request

from tests.utils.location_utils import LOCAL_URL


class Test_api_documentation:
    def test_api_documentation(self, test_client):
        r = Request('GET', LOCAL_URL + '/api/documentation')

        response = test_client.send(r)

        assert(response.status_code == 200)
        data = response.json
        print(data)
        assert 'get_endpoint_documentation' in data
        assert data['get_endpoint_documentation']['path'] == '/documentation'
        assert data['get_endpoint_documentation']['name'] == 'get_endpoint_documentation'
