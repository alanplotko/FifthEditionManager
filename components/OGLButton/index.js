import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { Button, COLOR, withTheme } from 'react-native-material-ui';
import Modal from 'react-native-modal';

class OGLButton extends React.Component {
  static propTypes = {
    sourceText: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLicenseVisible: false,
    };
  }

  render() {
    const { height } = Dimensions.get('window');
    const modalHeight = { height: height / 1.5 };

    // Theme setup
    const { textColor, noteColor, modalBackgroundColor } = this.props.theme.palette;
    const textStyle = { color: textColor };
    const noteStyle = { color: noteColor };
    const modalBackgroundStyle = { backgroundColor: modalBackgroundColor };

    return (
      <View style={styles.buttonContainer}>
        <Button
          style={{ text: [styles.buttonText, noteStyle] }}
          upperCase={false}
          text={this.props.sourceText}
          onPress={() => this.setState({ isLicenseVisible: true })}
        />
        <Modal
          isVisible={this.state.isLicenseVisible}
          onBackButtonPress={() => this.setState({ isLicenseVisible: false })}
          onBackdropPress={() => this.setState({ isLicenseVisible: false })}
          backdropOpacity={0.7}
          style={{ margin: 0 }}
        >
          <View style={[styles.modalContainer, modalBackgroundStyle, modalHeight]}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={[styles.title, textStyle]}>LICENSE</Text>
              <Text style={[styles.subtitle, textStyle]}>Open Game License (OGL)</Text>
              <Text style={[styles.licenseText, textStyle]}>
                Permission to copy, modify and distribute the files collectively known as the System
                Reference Document 5.1 (&quot;SRD5&quot;) is granted solely through the use of the
                Open Gaming License, Version 1.0a.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                This material is being released using the Open Gaming License Version 1.0a and you
                should read and understand the terms of that license before using this material.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                The text of the Open Gaming License itself is not Open Game Content. Instructions on
                using the License are provided within the License itself.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                The following items are designated Product Identity, as defined in Section 1(e) of
                the Open Game License Version 1.0a, and are subject to the conditions set forth in
                Section 7 of the OGL, and are not Open Content: Dungeons & Dragons, D&D, Player’s
                Handbook, Dungeon Master, Monster Manual, d20 System, Wizards of the Coast, d20
                (when used as a trademark), Forgotten Realms, Faerûn, proper names (including those
                used in the names of spells or items), places, Underdark, Red Wizard of Thay, the
                City of Union, Heroic Domains of Ysgard, EverChanging Chaos of Limbo, Windswept
                Depths of Pandemonium, Infinite Layers of the Abyss, Tarterian Depths of Carceri,
                Gray Waste of Hades, Bleak Eternity of Gehenna, Nine Hells of Baator, Infernal
                Battlefield of Acheron, Clockwork Nirvana of Mechanus, Peaceable Kingdoms of
                Arcadia, Seven Mounting Heavens of Celestia, Twin Paradises of Bytopia, Blessed
                Fields of Elysium, Wilderness of the Beastlands, Olympian Glades of Arborea,
                Concordant Domain of the Outlands, Sigil, Lady of Pain, Book of Exalted Deeds, Book
                of Vile Darkness, beholder, gauth, carrion crawler, tanar’ri, baatezu, displacer
                beast, githyanki, githzerai, mind flayer, illithid, umber hulk, yuan-ti. All of the
                rest of the SRD5 is Open Game Content as described in Section 1(d) of the License.
                The terms of the Open Gaming License Version 1.0a are as follows:
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                OPEN GAME LICENSE Version 1.0a
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                The following text is the property of Wizards of the Coast, Inc. and is Copyright
                2000 Wizards of the Coast, Inc (&quot;Wizards&quot;). All Rights Reserved.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                1. Definitions: (a) &quot;Contributors&quot; means the copyright and/or trademark
                owners who have contributed Open Game Content; (b) &quot;Derivative Material&quot;
                means copyrighted material including derivative works and translations (including
                into other computer languages), potation, modification, correction, addition,
                extension, upgrade, improvement, compilation, abridgment or other form in which an
                existing work may be recast, transformed or adapted; (c) &quot;Distribute&quot;
                means to reproduce, license, rent, lease, sell, broadcast, publicly display,
                transmit or otherwise distribute; (d) &quot;Open Game Content&quot; means the game
                mechanic and includes the methods, procedures, processes and routines to the extent
                such content does not embody the Product Identity and is an enhancement over the
                prior art and any additional content clearly identified as Open Game Content by the
                Contributor, and means any work covered by this License, including translations and
                derivative works under copyright law, but specifically excludes Product Identity.
                (e) &quot;Product Identity&quot; means product and product line names, logos and
                identifying marks including trade dress; artifacts; creatures characters; stories,
                storylines, plots, thematic elements, dialogue, incidents, language, artwork,
                symbols, designs, depictions, likenesses, formats, poses, concepts, themes and
                graphic, photographic and other visual or audio representations; names and
                descriptions of characters, spells, enchantments, personalities, teams, personas,
                likenesses and special abilities; places, locations, environments, creatures,
                equipment, magical or supernatural abilities or effects, logos, symbols, or graphic
                designs; and any other trademark or registered trademark clearly identified as
                Product identity by the owner of the Product Identity, and which specifically
                excludes the Open Game Content; (f) &quot;Trademark&quot; means the logos, names,
                mark, sign, motto, designs that are used by a Contributor to identify itself or its
                products or the associated products contributed to the Open Game License by the
                Contributor (g) &quot;Use&quot;, &quot;Used&quot; or &quot;Using&quot; means to use,
                Distribute, copy, edit, format, modify, translate and otherwise create Derivative
                Material of Open Game Content. (h) &quot;You&quot; or &quot;Your&quot; means the
                licensee in terms of this agreement.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                2. The License: This License applies to any Open Game Content that contains a notice
                indicating that the Open Game Content may only be Used under and in terms of this
                License. You must affix such a notice to any Open Game Content that you Use. No
                terms may be added to or subtracted from this License except as described by the
                License itself. No other terms or conditions may be applied to any Open Game Content
                distributed using this License.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                3. Offer and Acceptance: By Using the Open Game Content You indicate Your acceptance
                of the terms of this License.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                4. Grant and Consideration: In consideration for agreeing to use this License, the
                Contributors grant You a perpetual, worldwide, royalty-free, non-exclusive license
                with the exact terms of this License to Use, the Open Game Content.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                5. Representation of Authority to Contribute: If You are contributing original
                material as Open Game Content, You represent that Your Contributions are Your
                original creation and/or You have sufficient rights to grant the rights conveyed by
                this License.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                6. Notice of License Copyright: You must update the COPYRIGHT NOTICE portion of this
                License to include the exact text of the COPYRIGHT NOTICE of any Open Game Content
                You are copying, modifying or distributing, and You must add the title, the
                copyright date, and the copyright holder&apos;s name to the COPYRIGHT NOTICE of any
                original Open Game Content you Distribute.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                7. Use of Product Identity: You agree not to Use any Product Identity, including as
                an indication as to compatibility, except as expressly licensed in another,
                independent Agreement with the owner of each element of that Product Identity. You
                agree not to indicate compatibility or co-adaptability with any Trademark or
                Registered Trademark in conjunction with a work containing Open Game Content except
                as expressly licensed in another, independent Agreement with the owner of such
                Trademark or Registered Trademark. The use of any Product Identity in Open Game
                Content does not constitute a challenge to the ownership of that Product Identity.
                The owner of any Product Identity used in Open Game Content shall retain all rights,
                title and interest in and to that Product Identity.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                8. Identification: If you distribute Open Game Content You must clearly indicate
                which portions of the work that you are distributing are Open Game Content.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                9. Updating the License: Wizards or its designated Agents may publish updated
                versions of this License. You may use any authorized version of this License to
                copy, modify and distribute any Open Game Content originally distributed under any
                version of this License.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                10. Copy of this License: You MUST include a copy of this License with every copy of
                the Open Game Content You Distribute.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                11. Use of Contributor Credits: You may not market or advertise the Open Game
                Content using the name of any Contributor unless You have written permission from
                the Contributor to do so.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                12. Inability to Comply: If it is impossible for You to comply with any of the terms
                of this License with respect to some or all of the Open Game Content due to statute,
                judicial order, or governmental regulation then You may not Use any Open Game
                Material so affected.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                13. Termination: This License will terminate automatically if You fail to comply
                with all terms herein and fail to cure such breach within 30 days of becoming aware
                of the breach. All sublicenses shall survive the termination of this License.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                14. Reformation: If any provision of this License is held to be unenforceable, such
                provision shall be reformed only to the extent necessary to make it enforceable.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                15. COPYRIGHT NOTICE Open Game License v 1.0a Copyright 2000, Wizards of the Coast,
                LLC.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                System Reference Document 5.1 Copyright 2016, Wizards of the Coast, Inc.; Authors
                Mike Mearls, Jeremy Crawford, Chris Perkins, Rodney Thompson, Peter Lee, James
                Wyatt, Robert J. Schwalb, Bruce R. Cordell, Chris Sims, and Steve Townshend, based
                on original material by E. Gary Gygax and Dave Arneson.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                Pathfinder Roleplaying Game Advanced Race Guide, Copyright 2012, Paizo Publishing,
                LLC; Authors: Dennis Baker, Jesse Benner, Benjamin Bruck, Jason Bulmahn, Adam
                Daigle, Jim Groves, Tim Hitchcock, Hal MacLean, Jason Nelson, Stephen
                Radney-MacFarland, Owen K.C. Stephens, Todd Stewart, and Russ Taylor.
              </Text>
              <Text style={[styles.licenseText, textStyle]}>
                END OF LICENSE
              </Text>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  buttonText: {
    fontFamily: 'Roboto',
    color: COLOR.grey500,
    fontSize: 10,
  },
  modalContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLOR.white,
  },
  modalContent: {
    padding: 30,
  },
  title: {
    fontFamily: 'RobotoLight',
    color: COLOR.black,
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'RobotoBold',
    color: COLOR.black,
    fontSize: 18,
    marginBottom: 10,
  },
  licenseText: {
    fontFamily: 'Roboto',
    color: COLOR.black,
    fontSize: 14,
    marginBottom: 10,
  },
});

export default withTheme(OGLButton);
