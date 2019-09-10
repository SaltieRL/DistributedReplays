import ast
import inspect

from backend.blueprints.spa_api.utils.decorators import with_query_params, require_user
from backend.blueprints.spa_api.utils.query_params_handler import QueryParam
from backend.blueprints.spa_api.utils import query_param_definitions

query_param_decorator_name = with_query_params.__name__
query_param_class_name = QueryParam.__name__
query_param_definition_name = query_param_definitions.__name__
require_user_name = require_user.__name__


class FuncData:
    def __init__(self, name, function, decorators):
        self.decorators = decorators
        self.function = function
        self.name = name

    def get_query_param_info(self, imports, query_params, provided_params):
        """
        Parses the information from the query params decorators.
        :param imports:  The imports inside of spa_api that are used for compiling the decorators.
        :param query_params: The list that is filled with query parameter information
        :param provided_params:  The list that is filled with information around data inside the path.
        """
        decorator = {}

        def execute_module():
            fake_module = ast.parse("decorator['key']=''")
            query_params = self.decorators[query_param_decorator_name]
            assign = fake_module.body[0]
            assign.value = query_params
            module = ast.Module([
                *imports,
                *fake_module.body
            ])
            exec(compile(module, filename="<ast>", mode="exec"), globals(), {'decorator': decorator})
        execute_module()
        query_param_instance = decorator['key']
        if query_param_instance.accepted_query_params is not None:
            for query_param in query_param_instance.accepted_query_params:
                if query_param_instance.provided_params is None or query_param.name not in query_param_instance.provided_params:
                    # only add ones that are not provided in the
                    query_params.append(query_param.to_JSON())
                else:
                    provided_params.append(query_param.to_JSON())

    def get_documentation(self, imports):
        path = self.decorators['route'].args[0].s
        query_params = []
        provided_params = []
        if query_param_decorator_name in self.decorators:
            self.get_query_param_info(imports, query_params, provided_params)

        result = {"name": self.name, "path": path}

        if require_user_name in self.decorators:
            result['logged_in'] = True

        if len(query_params) > 0:
            result["query_params"] = query_params
        if len(provided_params) > 0:
            result["path_params"] = provided_params
        return result


def get_filtered_decorators(target):
    decorators = {}

    function_list = {name: obj for name, obj in inspect.getmembers(target)
                     if (inspect.isfunction(obj))}

    imports = []

    def visit_FunctionDef(node):
        decorator_list = dict()
        has_route = False
        for n in node.decorator_list:
            if isinstance(n, ast.Call):
                name = n.func.attr if isinstance(n.func, ast.Attribute) else n.func.id
            else:
                name = n.attr if isinstance(n, ast.Attribute) else n.id

            decorator_list[name] = n

            if name == 'route':
                has_route = True

        if has_route:
            decorators[node.name] = FuncData(node.name, function_list[node.name], decorator_list)

    def visit_ImportFrom(node):
        if query_param_definition_name in node.module:
            imports.append(node)
            return

    node_iter = ast.NodeVisitor()
    node_iter.visit_FunctionDef = visit_FunctionDef
    node_iter.visit_ImportFrom = visit_ImportFrom
    node_iter.visit(ast.parse(inspect.getsource(target), mode='exec'))
    return decorators, imports


def create_documentation_for_module(module):
    decorator_map, imports = get_filtered_decorators(module)

    del decorator_map['update_server']

    documentation = {}
    for key in decorator_map:
        documentation[key] = decorator_map[key].get_documentation(imports)

    return documentation
