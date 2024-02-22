import React from 'react';
import './CookingCalculator.css';
import Dishes from './Dishes';
import CookingIngredientIcons from './CookingIngredientIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { Icon } from '@iconify/react';

class CookingCalculator extends React.Component {
	constructor(props) {
		super();

		this.state = {
			currentTab: 'heal',
			selectedMeals: [],
			ingredientTotals: {}
		};

		this.tabs = {
			heal: React.createRef(),
			revive: React.createRef(),
			atk: React.createRef(),
			def: React.createRef()
		};

		this.starCss = {
			1: 'one-star-scroll',
			2: 'two-star-scroll',
			3: 'three-star-scroll',
			4: 'four-star-scroll',
			5: 'five-star-scroll'
		};
	}

	switchTab(which) {
		Object.keys(this.tabs).forEach((e) =>
			this.tabs[e].current.classList.remove('active')
		);

		this.tabs[which].current.classList.add('active');

		this.setState({ currentTab: which });
	}

	dishSelected(dish) {
		console.log('dish selected');
		if (this.state.selectedMeals.length === 0) {
			document.getElementById('mealprep').style.height = '100%';
		}
		if (_.find(this.state.selectedMeals, { name: dish.name }) === undefined) {
			dish.count = 1;
			let selectedMeals = this.state.selectedMeals.concat({ ...dish });
			let ingredientTotals = { ...this.state.ingredientTotals };
			Object.keys(dish.ingredients).forEach((i) => {
				if (ingredientTotals[i] === undefined) {
					ingredientTotals[i] = dish.ingredients[i];
				} else {
					ingredientTotals[i] += dish.ingredients[i];
				}
			});
			this.setState({ selectedMeals: selectedMeals, ingredientTotals });
		} else {
			this.addDish(dish);
		}
	}

	subtractDish(dish) {
		this.setState((prevState) => {
			if (dish.count - 1 === 0) {
				_.remove(prevState.selectedMeals, { name: dish.name });
			}
			let selectedMeals = prevState.selectedMeals.map((e) =>
				e.name === dish.name ? { ...e, count: e.count - 1 } : { ...e }
			);
			let ingredientTotals = { ...prevState.ingredientTotals };
			Object.keys(dish.ingredients).forEach((i) => {
				ingredientTotals[i] -= dish.ingredients[i];
				if (ingredientTotals[i] === 0) {
					delete ingredientTotals[i];
				}
			});
			return {
				selectedMeals: selectedMeals,
				ingredientTotals: ingredientTotals
			};
		});
	}

	addDish(dish) {
		this.setState((prevState) => {
			let selectedMeals = prevState.selectedMeals.map((e) =>
				e.name === dish.name ? { ...e, count: e.count + 1 } : { ...e }
			);
			Object.keys(dish.ingredients).forEach((ingredient) => {
				if (prevState.ingredientTotals[ingredient] === undefined) {
					prevState.ingredientTotals[ingredient] = dish.ingredients[ingredient];
				} else {
					prevState.ingredientTotals[ingredient] +=
						dish.ingredients[ingredient];
				}
			});
			let ingredientTotals = { ...prevState.ingredientTotals };
			return {
				selectedMeals: selectedMeals,
				ingredientTotals: ingredientTotals
			};
		});
	}

	rowSlideInStart(e) {
		let currHeight = this.state.selectedMeals.length * 105;
		if (currHeight > e.target.parentElement.parentElement.clientHeight) {
			e.target.parentElement.style.overflowY = 'auto';
		} else {
			e.target.parentElement.style.overflowY = 'hidden';
		}
	}

	rowSlideInEnd(e) {
		if (
			e.target.parentElement.scrollHeight >
			e.target.parentElement.parentElement.clientHeight
		) {
			e.target.parentElement.style.overflowY = 'auto';
		} else {
			e.target.parentElement.style.overflowY = 'hidden';
		}
	}

	render() {
		return (
			<div className="cook-container">
				<div className="panel panel-left">
					<div className="panel-title">Food</div>
					<div className="tabs">
						<div
							ref={this.tabs['heal']}
							onClick={(e) => this.switchTab('heal')}
							className="tab active">
							<img src="./imgs/heal.png" width="30" height="30" alt="heal" />
						</div>
						<div
							ref={this.tabs['revive']}
							onClick={(e) => this.switchTab('revive')}
							className="tab">
							<img
								src="./imgs/revive.png"
								width="30"
								height="30"
								alt="revive"
							/>
						</div>
						<div
							ref={this.tabs['atk']}
							onClick={(e) => this.switchTab('atk')}
							className="tab">
							<img src="./imgs/atk.png" width="30" height="30" alt="attack" />
						</div>
						<div
							ref={this.tabs['def']}
							onClick={(e) => this.switchTab('def')}
							className="tab">
							<img src="./imgs/def.png" width="30" height="30" alt="defense" />
						</div>
					</div>
					<div className="dish-container">
						<div className="dish-wrapper">
							{Dishes[this.state.currentTab].map((e, i) => (
								<div
									key={i}
									className={'dish-tile ' + this.starCss[e.stars]}
									onClick={() => this.dishSelected(e)}>
									<div className="dish-title">{e.name}</div>
									<div className="dish-effect">{e.effect}</div>
									<div className="dish-stars">
										{[...Array(e.stars)].map((e, i) => {
											return <FontAwesomeIcon key={i} icon={faStar} />;
										})}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="panel panel-mid">
					<div className="panel-title">Selected</div>
					<div className="mealprep-container" id="mealprep">
						{this.state.selectedMeals.map((e, i) => {
							return (
								<div
									onAnimationStart={this.rowSlideInStart.bind(this)}
									onAnimationEnd={this.rowSlideInEnd.bind(this)}
									key={i}
									className={
										'meal-row slide-in-bottom ' +
										this.starCss[e.stars].replace('-scroll', '')
									}>
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
										{Object.keys(e.ingredients).map((food, i) => {
											return (
												<div key={i} className="meal-ingredient">
													<div className="ingredient-icon">
														{CookingIngredientIcons[food]}
													</div>
													<div className="ingredient-name">
														{e.ingredients[food] +
															' ' +
															food.replace(/_/gi, ' ')}
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
				<div className="panel panel-right">
					<div className="panel-title">Totals</div>
					<div className="ingredient-totals">
						{Object.keys(this.state.ingredientTotals).map((key, i) => {
							return (
								<div key={i} className="ingredient-totals-row">
									{key} - {this.state.ingredientTotals[key]}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default CookingCalculator;
