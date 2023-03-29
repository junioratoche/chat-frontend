import { Box, Typography } from "@mui/material"
import React from "react"
import { useThemeContext } from "../../context/theme-context"
import { generateColorMode } from "../utils/enable-dark-mode"

export const FooterComponent = () => {
	const { theme } = useThemeContext()

	return (
		<Box mt={5}>
			<Typography variant="body2" color="inherit" align="center">
				<a className={"clrcstm lnk" + generateColorMode(theme)} target={"_blank"}
					href={"https://google.com"} rel="noreferrer">
          Chat Phygital
				</a>
				{" - "}
				{new Date().getFullYear()}
			</Typography>
		</Box>
	)
}
