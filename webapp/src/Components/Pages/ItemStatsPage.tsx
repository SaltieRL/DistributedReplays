import {
    Card,
    CardActionArea,
    CardMedia,
    createStyles,
    Grid, Tab, Tabs, TextField,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core"
import qs from "qs"
import * as React from "react"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router-dom"
import { Item, ItemFull, ItemListResponse, ItemUsage } from "../../Models/ItemStats"
import { StoreState } from "../../Redux"
import { getItemGraph, getItemInfo, getItems } from "../../Requests/Global"
import { ItemStatsGraph } from "../ItemStats/ItemStatsGraph"
import { ItemStatsUsers } from "../ItemStats/ItemStatsUsers"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"
import { ItemDisplay } from "../ItemStats/ItemDisplay"

const CATEGORIES = [
    {
        id: 1,
        name: "Bodies"
    },
    {
        id: 2,
        name: "Wheels"
    },
    {
        id: 3,
        name: "Rocket Boosts"
    },
    {
        id: 4,
        name: "Toppers"
    },
    {
        id: 5,
        name: "Antennas"
    },
    {
        id: 6,
        name: "Decals"
    },
    // {
    //     id: 8,
    //     name: "Paint Finishes"
    // },
    {
        id: 9,
        name: "Trails"
    },
    {
        id: 10,
        name: "Goal Explosions"
    },
    {
        id: 11,
        name: "Banners"
    },
    {
        id: 12,
        name: "Engine Audio"
    }
    // {
    //     id: 13,
    //     name: "Avatar Borders"
    // }
]

const styles = createStyles({
    itemListCard: {
        // maxWidth: 150
    },
    media: {
        height: 150
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
    listReloadSignal: boolean
    itemList?: ItemListResponse
    page: number
    limit: number
    search: string
    itemID?: number
    itemData?: ItemFull
    itemUsage?: ItemUsage
    category: number
}

type Props = ReturnType<typeof mapStateToProps>
    & WithStyles<typeof styles>
    & RouteComponentProps<{}>

class ItemsStatsPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {itemReloadSignal: false, listReloadSignal: false, page: 0, limit: 500, search: "", category: 2}
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

        const itemSearch = (
            <TextField value={this.state.search} onChange={this.handleSearchChange} placeholder={"Filter"}/>
        )


        const itemView = itemData ? (
            <Grid container spacing={24}>
                <Grid item xs={6} lg={3}>
                    <Grid item xs={12}>
                        <ItemDisplay item={itemData} paint={0}/>
                    </Grid>
                </Grid>
                {this.state.itemData && this.state.itemUsage && <>
                    <Grid item xs={6} lg={3}>
                        <ItemStatsUsers item={this.state.itemData}
                                        itemUsage={this.state.itemUsage}/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <ItemStatsGraph item={this.state.itemData}
                                        itemUsage={this.state.itemUsage}/>

                    </Grid>
                </>}
            </Grid>
        ) : null
        const filteredList = this.state.itemList ?
            this.state.itemList.items.filter(
                (item) => item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1)
            :
            []
        const itemsList = (
            <>
                {itemSearch}
                <Tabs
                    value={this.state.category}
                    onChange={this.handleSelectTab}
                >

                    {CATEGORIES.map((category: any) => {
                        return <Tab key={category.id} label={category.name} value={category.id}/>
                    })}
                </Tabs>
                <LoadableWrapper load={this.getItems} reloadSignal={this.state.listReloadSignal}>
                    {this.state.itemList && <Grid container spacing={16}>
                        {filteredList.map((item: Item) => {
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
            </>
        )

        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    {(this.props.loggedInUser && this.props.loggedInUser.beta) ?
                        <>
                            <Grid item xs={12}>
                                {this.state.itemID ? itemView : itemsList}
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
        return getItems(this.state.page, this.state.limit, this.state.category)
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
        this.setState({
                itemData: undefined,
                itemUsage: undefined,
                itemID: item.ingameid,
                itemReloadSignal: !this.state.itemReloadSignal
            },
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

    private readonly handleSelectTab = (_: React.ChangeEvent<{}>, selectedTab: number) => {
        this.setState({category: selectedTab, listReloadSignal: !this.state.listReloadSignal})
    }
    private readonly handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        this.setState({search: e.target.value})
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
