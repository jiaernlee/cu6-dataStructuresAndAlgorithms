// candy

// solution 1 - two pass greedy approach
// time: O(n)
// space: O(n)
var candy = function (ratings) {
  let candies = new Array(ratings.length).fill(1);

  for (let i = 1; i < candies.length; i++) {
    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
  }

  for (let i = ratings.length - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1])
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
  }

  return candies.reduce((a, b) => a + b, 0);
};

console.log(candy([1, 3, 5, 3, 2, 1]));

// solution 2 - brute force
// time: O(n^2)
// space: O(n)
var candy2 = function (ratings) {
  const candies = new Array(ratings.length).fill(1);

  let isStable = false;

  while (!isStable) {
    isStable = true;

    for (let i = 0; i < ratings.length; i++) {
      if (
        i > 0 &&
        ratings[i] > ratings[i - 1] &&
        candies[i] <= candies[i - 1]
      ) {
        candies[i] = candies[i - 1] + 1;
        isStable = false;
      }
      if (
        i < ratings.length - 1 &&
        ratings[i] > ratings[i + 1] &&
        candies[i] <= candies[i + 1]
      ) {
        candies[i] = candies[i + 1] + 1;
        isStable = false;
      }
    }
  }

  return candies.reduce((a, b) => a + b, 0);
};

console.log(candy2([1, 3, 5, 3, 2, 1]));

// burst balloons

//solution 1 -recursive dp array
// time: O(n^3) --tle in leetcode but works
// space: O(n^2)
var maxCoins = function (nums) {
  nums = [1, ...nums, 1];
  const dp = {};

  const dfs = (l, r) => {
    if (l > r) return 0;
    if (`${l},${r}` in dp) return dp[`${l},${r}`];

    dp[`${l},${r}`] = 0;

    for (let i = l; i < r + 1; i++) {
      let coins = nums[l - 1] * nums[i] * nums[r + 1];
      coins += dfs(l, i - 1) + dfs(i + 1, r);
      dp[`${l},${r}`] = Math.max(coins, dp[`${l},${r}`]);
    }

    return dp[`${l},${r}`];
  };
  return dfs(1, nums.length - 2);
};

console.log(maxCoins([3, 1, 5, 8]));

// solution 2 - bottom up dp
// time: O(n^3) --slightly faster than recursive
// space: O(n^2) -- 2d array
var maxCoins2 = function (nums) {
  nums = [1, ...nums, 1];
  const n = nums.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));

  for (let length = 1; length <= n - 2; length++) {
    for (let l = 1; l <= n - length - 1; l++) {
      const r = l + length - 1;
      for (let i = l; i <= r; i++) {
        const coins =
          nums[l - 1] * nums[i] * nums[r + 1] + dp[l][i - 1] + dp[i + 1][r];
        dp[l][r] = Math.max(dp[l][r], coins);
      }
    }
  }
  console.log(dp);
  return dp[1][n - 2];
};

console.log(maxCoins2([3, 1, 5, 8]));

// solution 3 - brute force (similar to solution1 but doesnt use dp --> recalculates everytime)
// time: O(n!) --
// space: O(n)
var maxCoins3 = function (nums) {
  function dfs(nums) {
    if (nums.length === 0) return 0;

    let maxCoins = 0;
    for (let i = 0; i < nums.length; i++) {
      let coins =
        (i - 1 >= 0 ? nums[i - 1] : 1) *
        nums[i] *
        (i + 1 < nums.length ? nums[i + 1] : 1);
      coins += dfs([...nums.slice(0, i), ...nums.slice(i + 1)]);
      maxCoins = Math.max(maxCoins, coins);
    }
    return maxCoins;
  }
  return dfs(nums);
};

console.log(maxCoins3([3, 1, 5, 8]));

// word break ii

// solution 1 -- dfs with memoization
// time:O(n^3)
// space:  O(n^2)
var wordBreak = function (s, wordDict) {
  const wordSet = new Set(wordDict);
  const memo = {};

  const dfs = (start) => {
    if (start === s.length) return [""];
    if (start in memo) return memo[start];

    const result = [];
    for (let end = start + 1; end <= s.length; end++) {
      const word = s.slice(start, end);

      if (wordSet.has(word)) {
        const subResults = dfs(end);
        for (let subResult of subResults) {
          const sentence = word + (subResult !== "" ? " " + subResult : "");
          result.push(sentence);
        }
      }
    }

    memo[start] = result;

    console.log(memo);
    return result;
  };

  return dfs(0);
};

console.log(wordBreak("catsanddog", ["cat", "cats", "and", "sand", "dog"]));

// solution 2 -- brute force
var wordBreak2 = function (s, wordDict) {
  const wordSet = new Set(wordDict);

  const dfs = (start) => {
    if (start === s.length) return [""];

    const result = [];

    for (let end = start + 1; end <= s.length; end++) {
      const word = s.slice(start, end);

      if (wordSet.has(word)) {
        const subResults = dfs(end);
        for (let subResult of subResults) {
          const sentence = word + (subResult ? " " + subResult : "");
          result.push(sentence);
        }
      }
    }
    return result;
  };
  return dfs(0);
};

// russian doll envelope
// solution 1
// time: O(n log n) --binary search lis
// space: O(n) --dp
var maxEnvelopes = function (envelopes) {
  envelopes.sort((a, b) => {
    if (a[0] === b[0]) return b[1] - a[1];
    else return a[0] - b[0];
  });
  const heightList = envelopes.map((envelope) => envelope[1]);
  return lis(heightList);
};

// binary search function
const lis = (heights) => {
  const dp = [];

  for (let height of heights) {
    let left = 0;
    let right = dp.length;

    while (left < right) {
      let mid = Math.floor((left + right) / 2);
      if (dp[mid] < height) left = mid + 1;
      else right = mid;
    }

    if (left < dp.length) dp[left] = height;
    else dp.push(height);
  }

  return dp.length;
};

console.log(
  maxEnvelopes([
    [5, 4],
    [6, 4],
    [6, 7],
    [2, 3],
  ])
);

// solution 2 -- dp (tle in leetcode)
// time: O(n^2)
// space: O(n)
var maxEnvelopes2 = function (envelopes) {
  envelopes.sort((a, b) => a[0] - b[0]);

  const dp = new Array(envelopes.length).fill(1);

  for (let i = 1; i < envelopes.length; i++) {
    for (let j = 0; j < i; j++) {
      if (
        envelopes[j][0] < envelopes[i][0] &&
        envelopes[j][1] < envelopes[i][1]
      ) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
};

console.log(
  maxEnvelopes2([
    [5, 4],
    [6, 4],
    [6, 7],
    [2, 3],
  ])
);
