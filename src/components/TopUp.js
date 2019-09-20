import React, { Component } from "react";
import {
	Pane,
	Heading,
	Button,
	Dialog,
	Paragraph,
	FormField,
	Strong,
	TextInputField,
	toaster
} from "evergreen-ui";
import Slider from "rc-slider";
import isEmail from "is-email";
import "rc-slider/assets/index.css";
import { requestTopUp } from "@/api";

class TopUp extends Component {
	state = {
		show: false,
		requestLoading: false,
		numberOfHours: 40,
		emailInput: "",
		isEmailInvalid: false
	};

	toggleDialog = (toggle = false) =>
		this.setState({
			show: toggle,
			requestLoading: false,
			numberOfHours: 40,
			emailInput: "",
			isEmailInvalid: false
		});
	onRequested = close => {
		this.setState({ requestLoading: true });
		this.sendRequest().then(success => {
			this.setState({ requestLoading: false });
			if (success) {
				close();
			}
		});
	};
	onHoursChange = value => {
		const { hoursSelection = [] } = this.props;
		if (hoursSelection.length > 0) {
			if (value >= hoursSelection[0].from) {
				this.setState({ numberOfHours: value });
			}
		}
	};
	calcTotal = (isInteger = false) => {
		if (this.exceedsTotalHours()) {
			return;
		}
		const { hoursSelection } = this.props;
		const { numberOfHours } = this.state;
		const { rate } =
			hoursSelection.length > 0
				? hoursSelection.find(
						({ from, to }) =>
							numberOfHours >= from && numberOfHours <= to
				  ) || {}
				: {};

		const total = rate * numberOfHours;

		if (isInteger) {
			return total;
		}

		return (total / 100).toFixed(2);
	};
	onEmailChange = value => {
		this.setState({ emailInput: value });
	};
	sendRequest = async () => {
		const { emailInput, numberOfHours } = this.state;
		if (!isEmail(emailInput)) {
			this.setState({ isEmailInvalid: true });
			return false;
		}

		try {
			await requestTopUp({
				email: emailInput,
				numberOfHours,
				total: this.calcTotal()
			});
			toaster.success(
				`Your request was submitted successfully! You will be contacted as soon as possible.`
			);
		} catch (e) {
			console.log(e);
			toaster.danger(
				`An error occured submitting a request for top up. Please contact your Freelancer.`
			);
		}

		return true;
	};

	exceedsTotalHours = () => {
		const { hoursSelection } = this.props;
		const { numberOfHours } = this.state;
		if (hoursSelection.length > 0) {
			if (numberOfHours > this.getTotalHours()) {
				return true;
			}
		}
		return false;
	};
	getTotalHours = () => {
		const { hoursSelection } = this.props;
		if (hoursSelection.length > 0) {
			return hoursSelection[hoursSelection.length - 1].to;
		}
		return 1000;
	};

	render() {
		const {
			show,
			requestLoading,
			numberOfHours,
			emailInput,
			isEmailInvalid
		} = this.state;
		const { emailDomain, hoursSelection } = this.props;

		return (
			<>
				<Dialog
					isShown={show}
					title="Request a Top Up"
					onCloseComplete={() => this.toggleDialog(false)}
					confirmLabel="Send Request"
					isConfirmLoading={requestLoading}
					onConfirm={this.onRequested}
					shouldCloseOnOverlayClick={false}
					width={680}
					contentContainerProps={{
						overflowX: "hidden"
					}}
					preventBodyScrolling={true}
				>
					<Pane>
						<Paragraph>
							To request a top up, select the number of hours you
							would like to acquire and an email to send the
							invoice to.
						</Paragraph>
						<Paragraph>
							Hours will be applied once the invoice has been
							settled.
						</Paragraph>
					</Pane>
					<Pane padding={20} />
					<Pane>
						<Pane>
							<FormField label="Number of Hours">
								<Pane padding={20}>
									<Slider
										max={this.getTotalHours() + 10}
										defaultValue={numberOfHours}
										value={numberOfHours}
										onChange={this.onHoursChange}
									/>
								</Pane>
							</FormField>
						</Pane>
						<Pane
							display="flex"
							alignItems="center"
							justifyContent="center"
							flexDirection="row"
							textAlign="center"
							margin={-20}
						>
							<Pane padding={20}>
								<Strong opacity={0.5}>Hours</Strong>
								<Heading size={800}>
									{this.exceedsTotalHours()
										? `${this.getTotalHours()}+`
										: numberOfHours}
								</Heading>
							</Pane>
							<Pane padding={20}>
								<Strong opacity={0.5}>Total</Strong>
								<Heading size={800}>
									{this.exceedsTotalHours()
										? "Let's get in touch!"
										: `$${this.calcTotal()}`}
								</Heading>
							</Pane>
						</Pane>
					</Pane>
					<Pane padding={20} />
					<Pane>
						<TextInputField
							label="Contact Email"
							description="The email to receive the invoice for top up."
							placeholder={`project-manager@${
								!!emailDomain ? emailDomain : "company.com.au"
							}`}
							isInvalid={isEmailInvalid}
							inputHeight={42}
							onChange={e => this.onEmailChange(e.target.value)}
							value={emailInput}
							validationMessage={
								isEmailInvalid
									? `Please enter a valid email`
									: null
							}
						/>
					</Pane>
				</Dialog>
				<Button
					height={48}
					appearance="primary"
					intent="none"
					iconBefore="double-chevron-up"
					disabled={
						!!hoursSelection ? hoursSelection.length === 0 : true
					}
					onClick={() => this.toggleDialog(true)}
				>
					Request a Top Up
				</Button>
			</>
		);
	}
}

export default TopUp;
