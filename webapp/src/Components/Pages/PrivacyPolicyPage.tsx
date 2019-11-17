import { Card, CardContent, CardHeader, Divider, Grid } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { BasePage } from "./BasePage"

export class PrivacyPolicyPage extends React.PureComponent {
    public render() {
        return (
            <BasePage useSplash>
                <Grid container justify="center">
                    <Grid item xs={12} lg={10} xl={8}>
                        <Grid container spacing={2} justify="center">
                            <Card>
                                <CardHeader title="Privacy Policy"/>
                                <Divider/>
                                <CardContent>
                                    <Typography>
                                        <p>This privacy policy will explain how our
                                            website uses the personal data we collect from you when you use our
                                            website.</p><p>Topics:</p>
                                        <ul>
                                            <li>What data do we collect?</li>
                                            <li>How do we collect your data?</li>
                                            <li>How will we use your data?</li>
                                            <li>How do we use cookies?</li>
                                            <li>What types of cookies do we use?</li>
                                            <li>How to manage your cookies</li>
                                            <li>Privacy policies of other websites</li>
                                            <li>Changes to our privacy policy</li>
                                            <li>How to contact us</li>
                                        </ul>
                                        <h3>What data do we collect?</h3><p>Calculated.gg collects the following
                                        data:</p>
                                        <ul>
                                            <li>Uploaded replays</li>
                                        </ul>
                                        <h3>How do we collect your data?</h3><p>You directly provide Calculated.gg
                                        with
                                        most of the data we collect. We collect data and process data when you:</p>
                                        <ul>
                                            <li>Voluntarily upload a replay to the site.</li>
                                        </ul>
                                        <p>Calculated.gg may also receive your data indirectly from the following
                                            sources:</p>
                                        <ul>
                                            <li>Google Analytics</li>
                                        </ul>
                                        <h3>How will we use your data?</h3><p>Calculated.gg collects your data so
                                        that we
                                        can:</p>
                                        <ul>
                                            <li>Provide the website's required services</li>
                                        </ul>
                                        <h3>How do we use cookies?</h3>
                                        <p>Calculated.gg uses cookies in a range of ways to improve your experience
                                            on our
                                            website, including:</p>
                                        <ul>
                                            <li>Understanding how you use our website</li>
                                            <li>Maintaining log-in status</li>
                                        </ul>
                                        <h3>What types of cookies do we use?</h3>
                                        <p>There are a number of different
                                            types of cookies, however, our website uses:</p>
                                        <ul>
                                            <li>Functionality – Calculated.gg uses these cookies so that we
                                                recognize you
                                                on our website and remember your previously selected preferences.
                                                These
                                                could include your profile URL and other settings.
                                            </li>
                                            <li>
                                                Tracking - Calculated.gg uses these cookies through Google Analytics
                                                to
                                                determine how users use our site,
                                                to allow us to properly analyze user flow and traffic.
                                            </li>
                                        </ul>
                                        <h3>How to manage cookies</h3>
                                        <p>You can set your browser not to accept cookies or remove currently set
                                            cookies.
                                            For
                                            info, see <a
                                                href={"http://www.allaboutcookies.org"}>allaboutcookies.org</a>.
                                            However, in a few cases, some of our website features may not function
                                            as a
                                            result.</p>

                                        <h3>Privacy policies of other websites</h3>

                                        <p>The Calculated.gg website contains links to other websites. Our privacy
                                            policy
                                            applies only to
                                            our website, so if you click on a link to another website, you should
                                            read
                                            their privacy policy.</p>

                                        <h3>Changes to our privacy policy</h3>

                                        <p>The site keeps its privacy policy under regular review and places any
                                            updates
                                            on this web page. This privacy policy was last updated on 5 April
                                            2019.</p>

                                        <h3>How to contact us</h3>
                                        <p>If you have any questions about Calculated.gg’s privacy policy, the data we
                                            hold on you, or you would like to
                                            exercise one of your data protection rights, please do not hesitate to
                                            contact us.</p>
                                        <p>Email us at: saltie.calculated.gg_at_gmail_dot_com</p>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }
}
