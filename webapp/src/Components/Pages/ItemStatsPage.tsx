import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    createStyles,
    Grid,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core"
import qs from "qs"
import * as React from "react"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router-dom"
import { StoreState } from "../../Redux"
import { getItemInfo, getItems, getItemGraph } from "../../Requests/Global"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"
import { Item, ItemFull, ItemListResponse, ItemUsage } from "../../Models/ItemStats"

const styles = createStyles({
    itemListCard: {
        // maxWidth: 150
    },
    media: {
        height: 150
    },
    content: {
        width: "calc(100% - 128px)"
    },
    itemCard: {
        display: "flex",
        minHeight: 128
    }
})
const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

interface ItemQueryParams {
    item: number
}

interface State {
    itemReloadSignal: boolean
    itemList?: ItemListResponse
    page: number
    limit: number
    search: string
    itemID?: number
    itemData?: ItemFull
    itemUsage?: ItemUsage
}

type Props = ReturnType<typeof mapStateToProps>
    & WithStyles<typeof styles>
    & RouteComponentProps<{}>

class ItemsStatsPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {itemReloadSignal: false, page: 0, limit: 500, search: ""}
    }

    public componentDidMount() {
        this.readQueryParams()
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.location.search !== this.props.location.search) {
            this.readQueryParams()
        }
    }

    public render() {
        const {classes} = this.props
        const {itemData} = this.state
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    {(this.props.loggedInUser && this.props.loggedInUser.beta) ?
                        <>
                            <Grid item xs={12}>
                                {this.state.itemID ? <>
                                        {itemData && (
                                            <Grid container>
                                                <Grid item xs={3}>
                                                    <Grid item xs={12}>
                                                        <Card className={classes.itemCard}>
                                                            <CardMedia style={{flex: "0 0 128px"}}
                                                                       image={itemData.image}/>
                                                            <CardContent className={classes.content}>
                                                                <Typography>
                                                                    {itemData.name}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </>
                                    :
                                    <LoadableWrapper load={this.getItems}>
                                        {this.state.itemList && <Grid container spacing={16}>
                                            {this.state.itemList.items.map((item: Item) => {
                                                return (
                                                    <Grid item xs={6} sm={2} lg={1} key={item.ingameid}>
                                                        <Card className={classes.itemListCard}>
                                                            <CardActionArea onClick={() => {
                                                                this.selectItem(item)
                                                            }}>
                                                                <CardMedia
                                                                    className={classes.media}
                                                                    image={item.image}
                                                                    title={item.name}
                                                                />
                                                            </CardActionArea>
                                                        </Card>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>}
                                    </LoadableWrapper>
                                }
                            </Grid>
                        </>
                        :
                        <Typography>Patrons only.</Typography>
                    }
                </Grid>
            </BasePage>
        )
    }

    private readonly getItems = (): Promise<void> => {
        return getItems(this.state.page, this.state.limit, this.state.search, 3)
            .then((packs: ItemListResponse) => this.setState({itemList: packs}))
    }

    private readonly getItem = (): Promise<void> => {
        if (this.state.itemID) {
            return Promise.all([getItemInfo(this.state.itemID), getItemGraph(this.state.itemID)])
                .then((data) => this.setState({itemData: data[0], itemUsage: data[1]}))
        }
        return getItemInfo(0).then(() => {
        })
    }

    private readonly selectItem = (item: Item) => {
        this.setState({itemID: item.ingameid, itemReloadSignal: !this.state.itemReloadSignal},
            () => {
                this.setQueryParams()
                this.getItem()
            })
    }
    private readonly readQueryParams = () => {
        const queryString = this.props.location.search
        if (queryString !== "") {
            const queryParams: ItemQueryParams = qs.parse(
                this.props.location.search,
                {ignoreQueryPrefix: true}
            )
            if (queryParams.item) {
                this.setState({itemID: queryParams.item}, () => {

                    this.getItem()
                })
            }
        } else {
            this.setState({itemID: undefined})
        }
    }
    private readonly setQueryParams = () => {
        const queryString = qs.stringify(
            {item: this.state.itemID},
            {addQueryPrefix: true, indices: false}
        )
        if (this.props.location.search !== queryString) {
            this.props.history.push({search: queryString})
        }
    }

    // private readonly handleChangePage = (event: unknown, page: number) => {
    //     this.setState({page}, () => {
    //         this.getItems()
    //     })
    // }
    //
    // private readonly handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> =
    //     (event) => {
    //         this.setState({limit: Number(event.target.value)}, () => {
    //             this.getItems()
    //         })
    //     }
    // private readonly handleChangeSearch = (search: string) => {
    //     this.setState({search}, () => {
    //         this.getItems()
    //     })
    // }
}

export const ItemsStatsPage = withStyles(styles)(connect(mapStateToProps)(ItemsStatsPageComponent))
