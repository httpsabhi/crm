const buildMongoQuery = ({ rules, logic }) => {
  const operatorMap = {
    ">": "$gt",
    "<": "$lt",
    "==": "$eq",
    ">=": "$gte",
    "<=": "$lte",
    "!=": "$ne",
  };

  const parseRule = (rule) => {
    const { field, operator, value } = rule;
    const mongoOperator = operatorMap[operator];

    if (!mongoOperator) {
      throw new Error(`Unsupported operator: ${operator}`);
    }

    if (field === "inactiveDays") {
      const daysAgo = new Date(
        Date.now() - Number(value) * 24 * 60 * 60 * 1000
      );

      const invertedOperatorMap = {
        $gt: "$lt",
        $lt: "$gt",
        $gte: "$lte",
        $lte: "$gte",
        $eq: "$eq",
        $ne: "$ne",
      };

      const lastVisitedOperator = invertedOperatorMap[mongoOperator];

      return {
        lastVisit: { [lastVisitedOperator]: daysAgo },
      };
    }

    return mongoOperator === "$eq"
      ? { [field]: Number(value) }
      : { [field]: { [mongoOperator]: Number(value) } };
  };

  if (!rules || rules.length === 0) return {};

  if (rules.length === 1) return parseRule(rules[0]);

  const parsedRules = rules.map(parseRule);
  return logic === "OR" ? { $or: parsedRules } : { $and: parsedRules };
};

module.exports = { buildMongoQuery };
