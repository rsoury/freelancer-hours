import React, { Component } from "react";
import { Pane, Heading, Spinner, Link, Icon, toaster } from "evergreen-ui";
import Helmet from "react-helmet";
import Header from "./Header";
import TopUp from "./TopUp";

import { getClient } from "@/api";

const NAVY_BLACK_COLOR = "rgba(0,0,14,1)";
const AIRTABLE_TIMESHEET_FORM = process.env.REACT_APP_AIRTABLE_TIMESHEET_FORM;

class App extends Component {
	state = {
		name: "",
		logo: "",
		remainingTime: null,
		emailDomain: "",
		hoursSelection: []
	};
	componentDidMount() {
		getClient()
			.then(
				({
					name,
					logo = [],
					remaining_time,
					email_domain,
					hours_rates = []
				}) => {
					let hoursSelection = [];
					try {
						hoursSelection = JSON.parse(hours_rates);
						console.log(hoursSelection);
					} catch (e) {
						console.error(e);
					}
					this.setState({
						remainingTime: remaining_time,
						logo: logo.length > 0 ? logo[0].url : null,
						emailDomain: email_domain || "",
						name,
						hoursSelection
					});
				}
			)
			.catch(e => {
				toaster.danger(
					`Could not find hours. Please make sure to use the link provided by your WebDoodle Freelancer.`,
					{
						id: "not-found",
						duration: 30
					}
				);
			});
	}
	secondsTohhmmss = (totalSeconds, options = {}) => {
		const { retainArray = false, bareValues = false } = options;
		let hours = Math.floor(totalSeconds / 3600);
		let minutes = Math.floor((totalSeconds - hours * 3600) / 60);
		let seconds = totalSeconds - hours * 3600 - minutes * 60;

		// round seconds
		seconds = Math.round(seconds * 100) / 100;

		const result = bareValues
			? [hours, minutes, seconds]
			: [
					hours < 10 ? "0" + hours : hours,
					minutes < 10 ? "0" + minutes : minutes,
					seconds < 10 ? "0" + seconds : seconds
			  ];
		if (retainArray) {
			return result;
		}

		return result.join(":");
	};
	// returns a number
	getRemainingHours = () => {
		const { remainingTime } = this.state;
		if (typeof remainingTime === "number") {
			const hhmmss = this.secondsTohhmmss(remainingTime, {
				retainArray: true,
				bareValues: true
			});
			let displayValue =
				hhmmss[1] > 0 && hhmmss[2] > 0 ? hhmmss[0] + 1 : hhmmss[0];
			return hhmmss[0] === 0 && hhmmss[1] === 0 && hhmmss[2] === 0
				? 0
				: displayValue;
		}
		return;
	};
	render() {
		const { name, emailDomain, logo, hoursSelection } = this.state;
		const remainingTime = this.getRemainingHours();
		return (
			<Pane
				display="flex"
				flexDirection="column"
				width="100%"
				maxWidth={1350}
				marginX="auto"
				overflow="hidden"
				height="100vh"
			>
				{!!name && (
					<Helmet>
						<title>Web Doodle Hours - {name}</title>
					</Helmet>
				)}
				<Header logo={logo} />
				<Pane
					display="flex"
					height="100%"
					flexDirection="column"
					flex={1}
				>
					<Pane
						display="flex"
						flexDirection="column"
						width="100%"
						alignItems="center"
						justifyContent="center"
						padding={50}
					>
						<Heading
							fontSize="240px"
							fontWeight={900}
							lineHeight="260px"
							letterSpacing={0}
							marginTop={-40}
							marginRight={10}
							color={NAVY_BLACK_COLOR}
						>
							{typeof remainingTime === "number" ? (
								remainingTime
							) : (
								<Pane
									height={150}
									width={200}
									paddingBottom={50}
									marginBottom={50}
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									<Spinner />
								</Pane>
							)}
						</Heading>
						<Heading
							color={NAVY_BLACK_COLOR}
							size={700}
							textTransform="uppercase"
							fontWeight={900}
							letterSpacing={2}
							fontSize={20}
							lineHeight="24px"
							opacity={0.5}
						>
							hours remaining
						</Heading>
						<Pane paddingTop={50} />
						<Pane>
							<TopUp
								emailDomain={emailDomain}
								hoursSelection={hoursSelection}
							/>
						</Pane>
						<Pane paddingTop={25} />
						<Pane>
							<Link
								href={AIRTABLE_TIMESHEET_FORM}
								target="_blank"
								rel="noopener"
								size={500}
								display="flex"
								flexDirection="row"
								alignItems="center"
								justifyContent="center"
							>
								<Icon
									icon="time"
									color="info"
									marginRight={10}
								/>
								<span>Request Timesheet</span>
							</Link>
						</Pane>
					</Pane>
				</Pane>
			</Pane>
		);
	}
}

export default App;
