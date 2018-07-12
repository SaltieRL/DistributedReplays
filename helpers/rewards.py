from helpers import binary_converter, reward_manager


class RewardCalculator():
    reward = 0

    def __init__(self):
        self.reward_manager = reward_manager.RewardManager()

    def read_file(self, fn):
        binary_converter.read_data(open(fn, 'rb'), self.process_pair, )
        return self.reward

    def process_pair(self, input_array, output_array):
        reward = self.reward_manager.get_reward(input_array)
        self.reward += reward
