import ast
import os
import sys
from typing import List


class TestImports:

    global_allowed_imports = ['sqlalchemy', 'RLBotServer', 'carball', 'flask', 'redis', 'gzip',
                              'flask_cors', 'werkzeug', 'bs4', 'torch', 'pandas', 'numpy',
                              'prometheus_client']
    test_imports = ['alchemy_mock', 'fakeredis', 'responses']

    black_list = ['utils']

    def get_native_modules(self) -> List:
        modules = sys.modules
        result_modules = dict()
        for module in modules:
            string_module = str(module)
            first_module = string_module.split('.')[0]
            if first_module.startswith("_"):
                continue
            result_modules[first_module] = True
        for allowed in self.global_allowed_imports:
            result_modules[allowed] = True
        nearly_final_list = list(result_modules.keys())
        for removed in self.black_list:
            if removed in nearly_final_list:
                nearly_final_list.remove(removed)
        return nearly_final_list

    def test_backend(self):
        self.assert_files_are_allowed('backend', ['backend'])

    def test_tests(self):
        self.assert_files_are_allowed('tests', ['backend', 'tests'] + self.test_imports)

    def assert_files_are_allowed(self, folder: str, allowed_imports: List[str]):

        files = self.get_files(os.path.join(os.path.dirname(os.path.abspath(__file__)), folder))
        failed_imports = self.check_imports(files, allowed_imports + self.get_native_modules())
        assert failed_imports == []

    def get_files(self, folder):
        f = []
        def filter_file(file):
            if '.pyc' in file:
                return False
            if '.py' not in file:
                return False
            if '__init__' in file:
                return False
            return True

        for (dirpath, dirnames, filenames) in os.walk(folder):
            for result_file in filter(filter_file, filenames):
                f.append(os.path.join(dirpath, result_file))

        return f

    def check_imports(self, files, allowed_imports):
        failed_imports = []
        for file in files:
            failed_imports.extend(self.check_file(os.path.abspath(file), allowed_imports))
        return failed_imports

    def check_file(self, full_path, allowed_imports) -> List[str]:
        failed_imports = []

        def check_import(node, module):
            if module.startswith('replay'):
                print("WAT")
            has_valid_import = False
            for valid_import in allowed_imports:
                if module.split('.')[0] == valid_import:
                    has_valid_import = True

                # ignore the config import it is special
                if module == 'config':
                    has_valid_import = True

            if not has_valid_import:
                print('failed module: ', str(full_path) + ": " + str(node.lineno) + ": " + module)
                failed_imports.append(str(full_path) + ": " + str(node.lineno) + ": " + module)

        def visit_Import(node):
            check_import(node, node.names[0].name)

        def visit_ImportFrom(node):
            check_import(node, node.module)

        data = open(full_path).read()
        tree = ast.parse(data, full_path)

        node_iter = ast.NodeVisitor()
        node_iter.visit_ImportFrom = visit_ImportFrom
        node_iter.visit_Import = visit_Import
        node_iter.visit(tree)

        return failed_imports