import React from "react";
import { Pane, Image, Heading, Link, Spinner } from "evergreen-ui";

import DoodleIcon from "@/assets/webdoodle-icon.png";

const Header = ({ logo }) => (
	<Pane is="header" display="flex" padding={10}>
		<Pane
			flex={1}
			alignItems="center"
			display="flex"
			justifyContent="center"
		>
			<Pane
				{...(typeof logo === "string"
					? {
							paddingRight: 20,
							marginRight: 20,
							borderRight: `1px solid rgb(240, 240, 240)`
					  }
					: {})}
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Link
					href="https://www.webdoodle.com.au/"
					target="_blank"
					rel="noopener"
				>
					<Image
						src={DoodleIcon}
						alt="Web Doodle Icon"
						title="Web Doodle Icon"
						width={50}
						marginRight={10}
					/>
				</Link>
				<Heading
					size={400}
					textTransform="uppercase"
					letterSpacing={2}
					fontWeight={900}
					fontSize={14}
					textDecoration="none"
				>
					Hours
				</Heading>
			</Pane>
			{typeof logo === "string" && (
				<Pane>
					{!!logo ? (
						<Image
							src={logo}
							alt="Hours Business Logo"
							title="Hours Business Logo"
							width={100}
							maxHeight={100}
						/>
					) : (
						<Spinner size={24} />
					)}
				</Pane>
			)}
		</Pane>
	</Pane>
);

export default Header;
