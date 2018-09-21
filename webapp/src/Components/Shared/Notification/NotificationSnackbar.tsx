import {
    createStyles,
    IconButton,
    Snackbar,
    SnackbarContent,
    Theme,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import {amber, green} from "@material-ui/core/colors"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import Close from "@material-ui/icons/Close"
import ErrorIcon from "@material-ui/icons/Error"
import InfoIcon from "@material-ui/icons/Info"
import WarningIcon from "@material-ui/icons/Warning"
import * as React from "react"
import {AppError} from "../../../Models/Error"

type NotificationVariant = "success" | "info" | "warning" | "error"

interface DefaultNotificationProps {
    variant: NotificationVariant
    message: string
    timeout: number
}

interface AppErrorProps {
    variant: "appError"
    appError: AppError
}

interface SnackbarProps {
    open: boolean
    handleClose: (event: any, reason?: string) => void
}

type OwnProps = DefaultNotificationProps | AppErrorProps

type Props = OwnProps
    & SnackbarProps
    & WithStyles<typeof styles>

class NotificationSnackbarComponent extends React.PureComponent<Props> {

    public render() {
        // const {classes, variant, message} = this.props
        const {classes, variant, message} = this.props.variant !== "appError" ? this.props
            : {
                ...this.props,
                variant: "error",
                message: `${this.props.appError.code} Error: ${this.props.appError.message}`
            }

        const {open, handleClose} = this.props

        const Icon = variantIcon[variant]
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                open={open}
                autoHideDuration={variant === "error" ? undefined : 6000}
                onClose={handleClose}
            >
                <SnackbarContent
                    className={classes[variant]}
                    message={
                        <Typography align="center" className={classes.message}>
                            <Icon className={classes.icon}/>
                            {message}
                        </Typography>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <Close/>
                        </IconButton>
                    ]}
                />
            </Snackbar>
        )
    }
}

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
}

const styles = (theme: Theme) => createStyles({
    icon: {
        marginRight: theme.spacing.unit
    },
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.palette.primary.dark
    },
    warning: {
        backgroundColor: amber[700]
    },
    message: {
        color: "#fff",
        display: "flex",
        alignItems: "center"
    }
})

export const NotificationSnackbar = withStyles(styles)(NotificationSnackbarComponent)
