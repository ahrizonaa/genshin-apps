import React from "react";
import "./CookingCalculator.css";
import Dishes from "./Dishes";
import CookingIngredientIcons from "./CookingIngredientIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { Icon } from "@iconify/react";

class CookingCalculator extends React.Component {
  constructor(props) {
    super();

    this.state = {
      currentTab: "heal",
      selectedMeals: [],
    };

    this.tabs = {
      heal: React.createRef(),
      revive: React.createRef(),
      atk: React.createRef(),
      def: React.createRef(),
    };

    this.starCss = {
      1: "one-star",
      2: "two-star",
      3: "three-star",
      4: "four-star",
      5: "five-star",
    };
  }

  switchTab(which) {
    Object.keys(this.tabs).forEach((e) =>
      this.tabs[e].current.classList.remove("active")
    );

    this.tabs[which].current.classList.add("active");

    this.setState({ currentTab: which });
  }

  dishSelected(dish) {
    if (_.find(this.state.selectedMeals, { name: dish.name }) == undefined) {
      dish.count = 1;
      let tmpArray = this.state.selectedMeals.concat(dish);
      this.setState({ selectedMeals: tmpArray });
    } else {
      this.setState((prevState) => ({
        selectedMeals: prevState.selectedMeals.map((e) =>
          e.name == dish.name ? { ...e, count: e.count + 1 } : e
        ),
      }));
    }
  }

  subtractDish(dish) {
    this.setState((prevState) => {
      if (dish.count - 1 == 0) {
        _.remove(prevState.selectedMeals, { name: dish.name });
      }
      return {
        selectedMeals: prevState.selectedMeals.map((e) =>
          e.name == dish.name ? { ...e, count: e.count - 1 } : e
        ),
      };
    });
  }

  addDish(dish) {
    this.setState((prevState) => ({
      selectedMeals: prevState.selectedMeals.map((e) =>
        e.name == dish.name ? { ...e, count: e.count + 1 } : e
      ),
    }));
  }

  render() {
    return (
      <div className="cook-container">
        <div className="panel panel-left">
          <div className="tabs">
            <div
              ref={this.tabs["heal"]}
              onClick={(e) => this.switchTab("heal")}
              className="tab active"
            >
              <img src="./imgs/heal.png" width="30" height="30" />
            </div>
            <div
              ref={this.tabs["revive"]}
              onClick={(e) => this.switchTab("revive")}
              className="tab"
            >
              <img src="./imgs/revive.png" width="30" height="30" />
            </div>
            <div
              ref={this.tabs["atk"]}
              onClick={(e) => this.switchTab("atk")}
              className="tab"
            >
              <img src="./imgs/atk.png" width="30" height="30" />
            </div>
            <div
              ref={this.tabs["def"]}
              onClick={(e) => this.switchTab("def")}
              className="tab"
            >
              <img src="./imgs/def.png" width="30" height="30" />
            </div>
          </div>
          <div className="dish-container">
            <div className="dish-wrapper">
              {Dishes[this.state.currentTab].map((e) => (
                <div
                  className={"dish-tile " + this.starCss[e.stars]}
                  onClick={() => this.dishSelected(e)}
                >
                  <div className="dish-title">{e.name}</div>
                  <div className="dish-effect">{e.effect}</div>
                  <div className="dish-stars">
                    {[...Array(e.stars)].map((e) => {
                      return <FontAwesomeIcon icon={faStar} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel panel-right">
          <div className="mealprep-container">
            {this.state.selectedMeals.map((e) => {
              return (
                <div className={"meal-row " + this.starCss[e.stars]}>
                  <div className="meal-header">
                    <div className="meal-name">{e.name}</div>
                    <div className="meal-qty">
                      <Icon
                        onClick={() => this.subtractDish(e)}
                        className="meal-icon minus"
                        icon="carbon:subtract"
                      />
                      <span className="meal-count">{e.count}</span>
                      <Icon
                        onClick={() => this.addDish(e)}
                        className="meal-icon plus"
                        icon="carbon:add"
                      />
                    </div>
                  </div>
                  <div className="meal-ingredients">
                    {Object.keys(e.ingredients).map((food) => {
                      return (
                        <div className="meal-ingredient">
                          <div className="ingredient-icon">
                            {CookingIngredientIcons[food]}
                          </div>
                          <div className="ingredient-name">
                            {e.ingredients[food] +
                              " " +
                              food.replace(/_/gi, " ")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel">
          <span>Totals</span>
        </div>
      </div>
    );
  }
}

export default CookingCalculator;
